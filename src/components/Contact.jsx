import { useState } from "react";

export default function Example() {
  const [agreed, setAgreed] = useState(false);

  return (
    <div className="main-form relative isolate px-6 py-24 sm:py-32 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <h3 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Kontaktieren Sie uns
        </h3>
        <p className="mt-2 text-lg leading-8 text-gray-600">
          Haben wir Sie überzeugt? Teilen Sie uns gerne Ihr Projekt mit!
        </p>
      </div>
      <form
        action="https://formsubmit.co/YOUR_EMAIL"
        method="POST"
        className="mx-auto mt-4 max-w-xl sm:mt-8"
      >
        <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
          <div>
            <label
              htmlFor="vorname"
              className="block text-sm font-semibold leading-6 text-gray-900"
            >
              Vorname
            </label>
            <div className="mt-2.5">
              <input
                type="text"
                name="vorname"
                id="vorname"
                required
                autoComplete="given-name"
                className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-stone-400 sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="nachname"
              className="block text-sm font-semibold leading-6 text-gray-900"
            >
              Nachname
            </label>
            <div className="mt-2.5">
              <input
                type="text"
                name="nachname"
                id="nachname"
                autoComplete="family-name"
                required
                className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-stone-400 sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          <div className="sm:col-span-2">
            <label
              htmlFor="company"
              className="block text-sm font-semibold leading-6 text-gray-900"
            >
              Firma
            </label>
            <div className="mt-2.5">
              <input
                type="text"
                name="company"
                id="company"
                autoComplete="organization"
                className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-stone-400 sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          <div className="sm:col-span-2">
            <label
              htmlFor="email"
              className="block text-sm font-semibold leading-6 text-gray-900"
            >
              E-Mail
            </label>
            <div className="mt-2.5">
              <input
                type="email"
                name="email"
                id="email"
                required
                autoComplete="email"
                className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-stone-400 sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          <div className="sm:col-span-2">
            <label
              htmlFor="phone-number"
              className="block text-sm font-semibold leading-6 text-gray-900"
            >
              Telefonnummer
            </label>
            <div className="relative mt-2.5">
              <input
                type="tel"
                name="phone-number"
                id="phone-number"
                autoComplete="tel"
                className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-stone-400 sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          <div className="sm:col-span-2">
            <label
              htmlFor="nachricht"
              className="block text-sm font-semibold leading-6 text-gray-900"
            >
              Ihre Nachricht
            </label>
            <div className="mt-2.5">
              <textarea
                name="nachricht"
                id="nachricht"
                required
                rows={4}
                className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-stone-400 sm:text-sm sm:leading-6"
                defaultValue={""}
              />
            </div>
          </div>
          <div className="sm:col-span-2 flex items-center">
            <input
              id="link-checkbox"
              type="checkbox"
              name="agreed"
              value="true"
              required
              className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-gray-900 focus:ring-2 focus:ring-stone-400"
            />
            <label
              htmlFor="link-checkbox"
              className="ms-2 text-sm font-medium text-gray-900"
            >
              Ich habe die{" "}
              <a href="/datenschutz" className="text-blue-600 hover:underline">
                Datenschutzerklärung
              </a>{" "}
              gelesen und akzeptiert.
            </label>
          </div>
        </div>
        <div className="mt-10">
          <button
            type="submit"
            value="submit"
            className="block w-full rounded-md bg-stone-950 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm transition-all hover:bg-stone-700"
          >
            Nachricht abschicken
          </button>
        </div>
      </form>
    </div>
  );
}
