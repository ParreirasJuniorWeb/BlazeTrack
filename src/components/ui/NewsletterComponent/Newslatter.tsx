export default function Newsletter() {
  return (
    <section className="flex flex-col items-center text-white mt-12 py-6">
      <div className="flex flex-col items-center">
        <h2 className="text-center text-4xl font-semibold max-w-2xl">
          Subscribe{" "}
          <span className="bg-linear-to-t from-orange-600 to-black p-1 bg-left inline-block bg-no-repeat">
            newsletter
          </span>
        </h2>
        <p className="text-center text-slate-400 max-w-lg mt-3">
          A visual collection of our most recent works - each piece crafted with
          intention, emotion, and style.
        </p>
      </div>
      <div className="flex items-center justify-center mt-10 border border-slate-700 focus-within:outline focus-within:outline-orange-600 text-sm rounded-full h-14 max-w-xl w-full">
        <input
          className="bg-transparent outline-none rounded-full px-4 h-full flex-1 placeholder:text-slate-400"
          placeholder="Enter your email address"
          type="text"
        />
        <button className="bg-orange-600 text-white rounded-full h-11 mr-1 px-10 flex items-center justify-center hover:bg-orange-700 active:scale-95 transition">
          Subscribe
        </button>
      </div>
    </section>
  );
}
