import { useState } from "react";
import Head from "next/head";

const Contact = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");

  const sendEmail = (e) => {
    e.preventDefault();

    const data = {
      firstName,
      lastName,
      email,
      message,
    };

    fetch("/api/contact", {
      method: "post",
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }).then((res) => {
      res.status === 200 ? setStatus("success") : setStatus("error");
    });
  };

  return (
    <>
      <Head>
        <title>Contact | BrenzelBook</title>
      </Head>
      <div className="bg-white py-8 px-4 overflow-hidden">
        <div className="relative max-w-xl mx-auto">
          <div className="text-center">
            <h2 className="text-3xl leading-9 font-extrabold tracking-tight text-gray-900 sm:text-4xl sm:leading-10">
              Contact
            </h2>
          </div>
          <div className="mt-4">
            <form className="grid grid-cols-1 row-gap-6 sm:grid-cols-2 sm:col-gap-8">
              <div>
                <label
                  htmlFor="first_name"
                  className="block text-sm font-medium leading-5 text-gray-700"
                >
                  First name
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <input
                    id="first_name"
                    className="form-input py-3 px-4 block w-full transition ease-in-out duration-150"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="last_name"
                  className="block text-sm font-medium leading-5 text-gray-700"
                >
                  Last name
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <input
                    id="last_name"
                    className="form-input py-3 px-4 block w-full transition ease-in-out duration-150"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>
              </div>
              <div className="sm:col-span-2">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium leading-5 text-gray-700"
                >
                  Email
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <input
                    id="email"
                    type="email"
                    className="form-input py-3 px-4 block w-full transition ease-in-out duration-150"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
              <div className="sm:col-span-2">
                <label
                  htmlFor="message"
                  className="block text-sm font-medium leading-5 text-gray-700"
                >
                  Message
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <textarea
                    id="message"
                    rows="4"
                    className="form-textarea py-3 px-4 block w-full transition ease-in-out duration-150"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  ></textarea>
                </div>
              </div>
              <div className="sm:col-span-2">
                <span className="w-full inline-flex rounded-md shadow-sm">
                  <button
                    type="button"
                    className="w-full inline-flex items-center justify-center px-6 py-3 border border-transparent text-base leading-6 font-medium rounded-md text-white bg-gray-800 hover:bg-gray-700 focus:outline-none focus:border-gray-700 focus:shadow-outline-gray active:bg-gray-700 transition ease-in-out duration-150"
                    onClick={sendEmail}
                  >
                    Let's talk
                  </button>
                </span>
              </div>
              {status === "success" && (
                <div className="sm:col-span-2">
                  <p class="bg-green-100 p-2">Email sent successfully!</p>
                </div>
              )}
              {status === "error" && (
                <div className="sm:col-span-2">
                  <p class="bg-red-100 p-2">An Error Occured</p>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Contact;
