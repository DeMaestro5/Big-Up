'use server';

import { revalidatePath } from 'next/cache';
import { connectToDatabase } from '../database/mongoose';
import { handleError } from '../utils';
import User from '../database/models/user.model';
import Image from '../database/models/image.model';
import { redirect } from 'next/navigation';

import { v2 as cloudinary } from 'cloudinary';

const populateUser = (query: any) =>
  query.populate({
    path: 'author',
    model: User,
    select: '_id firstName lastName ',
  });
//Add Image

export async function AddImage({ image, userId, path }: AddImageParams) {
  try {
    await connectToDatabase();
    const author = await User.findById(userId);

    if (!author) {
      throw new Error('user not found');
    }

    const newImage = await Image.create({
      ...image,
      author: author._id,
    });
    revalidatePath(path);

    return JSON.parse(JSON.stringify(newImage));
  } catch (error) {
    handleError(error);
  }
}

//Update Image
export async function UpdateImage({ image, userId, path }: UpdateImageParams) {
  try {
    await connectToDatabase();

    const imageToUpdate = await User.findByIdAndUpdate(userId);

    if (!imageToUpdate || imageToUpdate.author.toHexString() !== userId) {
      throw new Error('Unauthorized or image not found');
    }

    const updatedImage = await Image.findByIdAndUpdate(
      imageToUpdate._id,
      image,
      { new: true }
    );
    revalidatePath(path);

    return JSON.parse(JSON.stringify(updatedImage));
  } catch (error) {
    handleError(error);
  }
}

//Delete Image
export async function DeleteImage(imageId: string) {
  try {
    await connectToDatabase();

    await Image.findByIdAndDelete(imageId);
  } catch (error) {
    handleError(error);
  } finally {
    redirect('/');
  }
}

//Get Image
export async function getImageById(imageId: string) {
  try {
    await connectToDatabase();

    const image = await populateUser(Image.findById(imageId));

    if (!image) {
      throw new Error('Image not found');
    }

    return JSON.parse(JSON.stringify(image));
  } catch (error) {
    handleError(error);
  }
}

// Get all images

export async function getAllImages({
  limit = 9,
  page = 1,
  searchQuery = '',
}: {
  limit?: number;
  page: number;
  searchQuery?: string;
}) {
  try {
    connectToDatabase();

    cloudinary.config({
      cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
      secure: true,
    });

    let expression = 'folder=imaginify';

    if (searchQuery) {
      expression += `AND ${searchQuery}`;
    }

    const { resources } = await cloudinary.search
      .expression(expression)
      .execute();

    const resourcesId = resources.map((resource: any) => resource.public_id);

    let query = {};

    if (searchQuery) {
      query = {
        public_id: {
          $in: resourcesId,
        },
      };
    }

    const skipAmount = (Number(page) - 1) * limit;

    const images = await populateUser(Image.find(query))
      .sort({ updatedAt: -1 })
      .skip(skipAmount)
      .limit(limit);

    const totalImages = await Image.find(query).countDocuments();
    const savedImages = await Image.find().countDocuments();

    return {
      data: JSON.parse(JSON.stringify(images)),
      totalPages: Math.ceil(totalImages / limit),
      savedImages,
    };
  } catch (error) {
    handleError(error);
  }
}