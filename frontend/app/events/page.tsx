export default function Events() {
    return (
      <div className="w-screen h-screen flex items-center justify-center text-white">
        <Event/>
        <Event/>
      </div>
    );
  }



  function Event(){

    return (
        <div className="bg-white text-gray-800 rounded-lg shadow-lg p-6 md:p-10 text-center max-w-md m-10">
        <h1 className="text-2xl md:text-4xl font-bold mb-4">Upcoming Event</h1>
        <p className="text-lg md:text-xl mb-6">📅 Next Event:</p>
        <p className="text-2xl md:text-3xl font-semibold text-blue-600">January 12th</p>
        <button className="mt-6 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg shadow-md transition">
          Learn More
        </button>
      </div>
    )

  }
  