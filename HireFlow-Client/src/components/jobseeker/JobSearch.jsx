import { useState } from 'react'

function JobSearch({ onSearch }) {
  const [filters, setFilters] = useState({
    keyword: '',
    location: '',
    employmentType: '',
    minSalary: '',
    maxSalary: '',
  })

  const handleChange = (event) => {
    const { name, value } = event.target

    setFilters((previous) => ({
      ...previous,
      [name]: value,
    }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    onSearch(filters)
  }

  const handleClear = () => {
    const emptyFilters = {
      keyword: '',
      location: '',
      employmentType: '',
      minSalary: '',
      maxSalary: '',
    }

    setFilters(emptyFilters)
    onSearch(emptyFilters)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl bg-white p-6 shadow-sm"
    >
      <div className="grid gap-4 lg:grid-cols-5">

        {/* Keyword */}

        <input
          type="text"
          name="keyword"
          value={filters.keyword}
          onChange={handleChange}
          placeholder="Job title, skills..."
          className="rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />

        {/* Location */}

        <input
          type="text"
          name="location"
          value={filters.location}
          onChange={handleChange}
          placeholder="Location"
          className="rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />

        {/* Employment Type */}

        <select
          name="employmentType"
          value={filters.employmentType}
          onChange={handleChange}
          className="rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        >
          <option value="">
            Employment Type
          </option>

          <option value="FullTime">
            Full Time
          </option>

          <option value="PartTime">
            Part Time
          </option>

          <option value="Contract">
            Contract
          </option>

          <option value="Internship">
            Internship
          </option>

          <option value="Remote">
            Remote
          </option>
        </select>

        {/* Minimum Salary */}

        <input
          type="number"
          name="minSalary"
          value={filters.minSalary}
          onChange={handleChange}
          placeholder="Min salary"
          min="0"
          className="rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />

        {/* Maximum Salary */}

        <input
          type="number"
          name="maxSalary"
          value={filters.maxSalary}
          onChange={handleChange}
          placeholder="Max salary"
          min="0"
          className="rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />

      </div>

      <div className="mt-5 flex flex-wrap gap-3">

        <button
          type="submit"
          className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
        >
          Search Jobs
        </button>

        <button
          type="button"
          onClick={handleClear}
          className="rounded-lg border border-gray-300 px-6 py-3 font-semibold text-gray-700 hover:bg-gray-50"
        >
          Clear
        </button>

      </div>
    </form>
  )
}

export default JobSearch