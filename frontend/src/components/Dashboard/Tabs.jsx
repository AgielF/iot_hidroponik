import React from 'react'

function Tabs({arguments_1,arguments_2,arguments_3,arguments_4}) {


  return (
    
<div>
  <div className="sm:hidden">
    <label htmlFor="Tab" className="sr-only">Tab</label>

    <select id="Tab" className="w-full rounded-md border-gray-200">
      <option>{arguments_1}</option>
      <option>{arguments_2}</option>
      <option>{arguments_3}</option>
      <option>{arguments_4}</option>
    </select>
  </div>

  <div className="hidden sm:block">
    <div className="border-b border-gray-200">
      <nav className="-mb-px flex gap-6" aria-label="Tabs">
        <a
          href="#"
          className="shrink-0 border-b-2 border-transparent px-1 pb-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
        >
          {arguments_1}
        </a>

        <a
          href="#"
          className="shrink-0 border-b-2 border-transparent px-1 pb-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
        >
          {arguments_2}
        </a>

        <a
          href="#"
          className="shrink-0 border-b-2 border-transparent px-1 pb-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
        >
          {arguments_3}
        </a>

        <a
          href="#"
          className="shrink-0 border-b-2 border-sky-500 px-1 pb-4 text-sm font-medium text-sky-600"
          aria-current="page"
        >
          {arguments_4}
        </a>
      </nav>
    </div>
  </div>
</div>
    
  )
}

export default Tabs
