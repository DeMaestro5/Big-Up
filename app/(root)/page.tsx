import { SignedIn, SignedOut, SignInButton } from '@clerk/nextjs';

const Home = () => {
  return (
    <div>
      <SignedIn>
        <p>Home</p>
      </SignedIn>
      <SignedOut>
        <SignInButton />
      </SignedOut>
    </div>
  );
};

export default Home;
