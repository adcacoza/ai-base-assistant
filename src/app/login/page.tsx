/* eslint-disable react/no-unescaped-entities */
import { SignInButton, SignUpButton } from '@clerk/nextjs';
import { Button } from '@/components/atoms/button';

const LoginPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
        <h1 className="text-6xl font-bold">
          Welcome to{' '}
          <a className="text-blue-600" href="https://nextjs.org">
            MyApp
          </a>
        </h1>

        <p className="mt-3 text-2xl">Get started by signing in or signing up</p>

        <div className="flex flex-wrap items-center justify-around max-w-4xl mt-6 sm:w-full">
          <div className="p-6 mt-6 text-left border w-96 rounded-xl hover:text-blue-600 focus:text-blue-600">
            <h3 className="text-2xl font-bold">Sign In &rarr;</h3>
            <p className="mt-4 text-xl">
              Already have an account? Sign in here.
            </p>
            <div className="mt-6">
              <SignInButton>
                <Button>Sign In</Button>
              </SignInButton>
            </div>
          </div>

          <div className="p-6 mt-6 text-left border w-96 rounded-xl hover:text-blue-600 focus:text-blue-600">
            <h3 className="text-2xl font-bold">Sign Up &rarr;</h3>
            <p className="mt-4 text-xl">Don't have an account? Sign up here.</p>
            <div className="mt-6">
              <SignUpButton>
                <Button>Sign Up</Button>
              </SignUpButton>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LoginPage;
