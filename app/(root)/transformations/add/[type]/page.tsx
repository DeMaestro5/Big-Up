import Header from '@/components/share/Header';
import TransformationForm from '@/components/share/TransformationForm';
import { transformationTypes } from '@/constants';
import { getUserById } from '@/lib/actions/user.actions';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

const AddTransformationTypePage = async ({
  params: { type },
}: SearchParamProps) => {
  const { userId } = auth();
  const transformation = transformationTypes[type];

  if (!userId) redirect('/sign-in');

  const user = await getUserById(userId);

  return (
    <div className='p-4 sm:p-6 md:p-8 lg:p-10'>
      <Header title={transformation.title} subtitle={transformation.subTitle} />

      <section className='mt-10'>
        <TransformationForm
          action='Add'
          userId={user._id}
          type={transformation.type as TransformationTypeKey}
          creditBalance={user.creditBalance}
        />
      </section>
    </div>
  );
};

export default AddTransformationTypePage;
