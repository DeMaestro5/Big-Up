import React from 'react';

const Header = ({ title, subtitle }: { title: String; subtitle?: String }) => {
  return (
    <div>
      <h2 className='text-2xl lg:text-4xl md:text-3xl text-dark-600 font-bold'>
        {title}
      </h2>
      {subtitle && (
        <p className='mt-4 text-base lg:text-lg md:text-md text-dark-500'>
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default Header;
