import { useState } from "react";

export default function Example() {
  const [agreed, setAgreed] = useState(false);

  return (
    <div className="main-form relative isolate px-6 py-24 sm:py-32 lg:px-8">
      <div class="anchor block relative invisible -top-36" id="kontakt"></div>
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
        <div class="mt-4 inline-flex mx-auto w-full gap-2 items-center md:mt-6 flex-col md:flex-row justify-center">
          <a
            href="tel:020877890030"
            class="inline-flex items-center gap-1 rounded-lg bg-stone-950 px-5 py-3 text-center text-sm font-medium text-white transition-all hover:bg-stone-700 focus:outline-none focus:ring-4 focus:ring-stone-400"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="size-3 text-white"
              viewBox="0 0 512 512"
            >
              <path
                d="M164.9 24.6c-7.7-18.6-28-28.5-47.4-23.2l-88 24C12.1 30.2 0 46 0 64C0 311.4 200.6 512 448 512c18 0 33.8-12.1 38.6-29.5l24-88c5.3-19.4-4.6-39.7-23.2-47.4l-96-40c-16.3-6.8-35.2-2.1-46.3 11.6L304.7 368C234.3 334.7 177.3 277.7 144 207.3L193.3 167c13.7-11.2 18.4-30 11.6-46.3l-40-96z"
                fill="currentColor"
              />
            </svg>
            0208 / 77890030
          </a>
          <a
            href="mailto:Info@revinova.de"
            class="inline-flex items-center gap-2 rounded-lg bg-stone-950 px-5 py-3 text-center text-sm font-medium text-white transition-all hover:bg-stone-700 focus:outline-none focus:ring-4 focus:ring-stone-400"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
              class="size-3 text-white"
            >
              <path
                d="M48 64C21.5 64 0 85.5 0 112c0 15.1 7.1 29.3 19.2 38.4L236.8 313.6c11.4 8.5 27 8.5 38.4 0L492.8 150.4c12.1-9.1 19.2-23.3 19.2-38.4c0-26.5-21.5-48-48-48L48 64zM0 176L0 384c0 35.3 28.7 64 64 64l384 0c35.3 0 64-28.7 64-64l0-208L294.4 339.2c-22.8 17.1-54 17.1-76.8 0L0 176z"
                fill="currentColor"
              />
            </svg>
            info@revinova.de
          </a>
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
