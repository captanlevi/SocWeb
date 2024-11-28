export default function Landing() {
  return (
    <div className="w-screen h-screen flex flex-col justify-center items-center text-white">
      {/* Background Image */}

      {/* Content */}
      <div className="text-center max-w-3xl p-6 bg-black bg-opacity-50 rounded-lg shadow-lg">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">Welcome to BeerSoc!</h1>
        <p className="text-lg md:text-xl mb-6">
          Join us at the University of New South Wales BeerSoc, where we celebrate great beer, sizzling barbecues, and an amazing community. 
          Meet new friends, enjoy fun events, and make unforgettable memories!
        </p>

        <div className="mt-6 border-t border-gray-300 pt-4">
          <h2 className="text-2xl font-semibold mb-2">Contact Us</h2>
          <p className="text-lg">📞 John Doe: +61 400 123 456</p>
          <p className="text-lg">📞 Jane Smith: +61 400 654 321</p>
        </div>

      </div>
    </div>
  );
}
