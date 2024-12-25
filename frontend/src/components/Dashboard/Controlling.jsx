import React, { useState } from "react";

function Controlling() {
  const [activeTab, setActiveTab] = useState(1);

  const Tabs = ({ arguments_1, arguments_2, arguments_3, arguments_4 }) => {
    return (
      <div>
        {/* Mobile View */}
        <div className="sm:hidden">
          <label htmlFor="Tab" className="sr-only">
            Tab
          </label>

          <select
            id="Tab"
            className="w-full rounded-md border-gray-200"
            value={activeTab}
            onChange={(e) => setActiveTab(Number(e.target.value))}
          >
            <option value={1}>{arguments_1}</option>
            <option value={2}>{arguments_2}</option>
            <option value={3}>{arguments_3}</option>
            <option value={4}>{arguments_4}</option>
          </select>
        </div>

        {/* Desktop View */}
        <div className="hidden sm:block">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex gap-6" aria-label="Tabs">
              <a
                href="#"
                className={`shrink-0 border-b-2 ${
                  activeTab === 1
                    ? "border-sky-500 text-sky-600"
                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                } px-1 pb-4 text-sm font-medium`}
                onClick={() => setActiveTab(1)}
              >
                {arguments_1}
              </a>

              <a
                href="#"
                className={`shrink-0 border-b-2 ${
                  activeTab === 2
                    ? "border-sky-500 text-sky-600"
                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                } px-1 pb-4 text-sm font-medium`}
                onClick={() => setActiveTab(2)}
              >
                {arguments_2}
              </a>

              <a
                href="#"
                className={`shrink-0 border-b-2 ${
                  activeTab === 3
                    ? "border-sky-500 text-sky-600"
                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                } px-1 pb-4 text-sm font-medium`}
                onClick={() => setActiveTab(3)}
              >
                {arguments_3}
              </a>

              <a
                href="#"
                className={`shrink-0 border-b-2 ${
                  activeTab === 4
                    ? "border-sky-500 text-sky-600"
                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                } px-1 pb-4 text-sm font-medium`}
                onClick={() => setActiveTab(4)}
              >
                {arguments_4}
              </a>
            </nav>
          </div>
        </div>
      </div>
    );
  };

  const ButtonControlling = ({ arguments_btn_1, arguments_btn_2 }) => {
    return (
      <div className="mt-4 flex gap-4">
        <a
          className="inline-block rounded bg-indigo-600 px-8 py-3 text-sm font-medium text-white transition hover:scale-110 hover:shadow-xl focus:outline-none focus:ring active:bg-indigo-500"
          href="#"
        >
          {arguments_btn_1}
        </a>

        <a
          className="inline-block rounded border border-current px-8 py-3 text-sm font-medium text-indigo-600 transition hover:scale-110 hover:shadow-xl focus:outline-none focus:ring active:text-indigo-500"
          href="#"
        >
          {arguments_btn_2}
        </a>
      </div>
    );
  };

  return (
    <div>
      <Tabs
        arguments_1="Tab 1"
        arguments_2="Tab 2"
        arguments_3="Tab 3"
        arguments_4="Tab 4"
      />
      <div className="mt-4">
        {activeTab === 1 && (
          <div>
            <h2 className="text-lg font-semibold">Content for Tab 1</h2>
            <ButtonControlling
              arguments_btn_1="Tab 1 Action"
              arguments_btn_2="Tab 1 Option"
            />
          </div>
        )}
        {activeTab === 2 && (
          <div>
            <h2 className="text-lg font-semibold">Content for Tab 2</h2>
            <ButtonControlling
              arguments_btn_1="Tab 2 Action"
              arguments_btn_2="Tab 2 Option"
            />
          </div>
        )}
        {activeTab === 3 && (
          <div>
            <h2 className="text-lg font-semibold">Content for Tab 3</h2>
            <ButtonControlling
              arguments_btn_1="Tab 3 Action"
              arguments_btn_2="Tab 3 Option"
            />
          </div>
        )}
        {activeTab === 4 && (
          <div>
            <h2 className="text-lg font-semibold">Content for Tab 4</h2>
            <ButtonControlling
              arguments_btn_1="Tab 4 Action"
              arguments_btn_2="Tab 4 Option"
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default Controlling;
