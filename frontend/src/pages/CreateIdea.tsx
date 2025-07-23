"use client"

import type React from "react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { ArrowLeft, Sprout } from "lucide-react"
import type { IdeaCategory, GrowthStage } from "../types/idea"
import { getPlantTheme } from "../utils/sampleData"

export const CreateIdea: React.FC = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "technology" as IdeaCategory,
    stage: "seedling" as GrowthStage,
    tags: "",
    content: "",
  })

  const categories: IdeaCategory[] = ["technology", "business", "creative", "personal", "research", "innovation"]
  const stages: GrowthStage[] = ["seedling", "growing", "mature"]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, this would save to a database
    console.log("New idea:", {
      ...formData,
      tags: formData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    navigate("/ideas")
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const selectedTheme = getPlantTheme(formData.category)

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back to Garden</span>
      </button>

      {/* Header */}
      <div className="text-center mb-8">
        <div className="text-6xl mb-4">🌱</div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Plant a New Idea</h1>
        <p className="text-gray-600">Give your idea the care it needs to grow and flourish</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
            <Sprout className="h-5 w-5 text-green-600" />
            <span>Basic Information</span>
          </h2>

          <div className="space-y-6">
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Idea Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                required
                value={formData.title}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="What's your brilliant idea?"
              />
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Short Description *
              </label>
              <textarea
                id="description"
                name="description"
                required
                rows={3}
                value={formData.description}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                placeholder="Briefly describe your idea..."
              />
            </div>

            {/* Category and Stage */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  id="category"
                  name="category"
                  required
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="stage" className="block text-sm font-medium text-gray-700 mb-2">
                  Growth Stage *
                </label>
                <select
                  id="stage"
                  name="stage"
                  required
                  value={formData.stage}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  {stages.map((stage) => (
                    <option key={stage} value={stage}>
                      {stage.charAt(0).toUpperCase() + stage.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Tags */}
            <div>
              <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
                Tags
              </label>
              <input
                type="text"
                id="tags"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Enter tags separated by commas (e.g., AI, mobile, innovation)"
              />
              <p className="text-sm text-gray-500 mt-1">Separate multiple tags with commas</p>
            </div>
          </div>
        </div>

        {/* Detailed Content */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Detailed Notes</h2>
          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
              Detailed Description
            </label>
            <textarea
              id="content"
              name="content"
              rows={8}
              value={formData.content}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
              placeholder="Elaborate on your idea... What problem does it solve? How would it work? What makes it unique?"
            />
          </div>
        </div>

        {/* Preview */}
        <div className={`bg-white rounded-2xl shadow-sm border-2 ${selectedTheme.borderColor} p-8`}>
          <h2 className="text-xl font-bold text-gray-900 mb-6">Preview</h2>
          <div className="flex items-center space-x-3 mb-4">
            <div className="text-4xl">{selectedTheme.icon}</div>
            <div
              className={`px-3 py-1 rounded-full text-sm font-medium ${selectedTheme.bgColor} ${selectedTheme.color} capitalize`}
            >
              {formData.category}
            </div>
            <div className="text-sm text-gray-600 capitalize">{formData.stage}</div>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {formData.title || "Your idea title will appear here"}
          </h3>
          <p className="text-gray-600 mb-4">{formData.description || "Your description will appear here"}</p>
          {formData.tags && (
            <div className="flex flex-wrap gap-2">
              {formData.tags.split(",").map((tag, index) => (
                <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                  {tag.trim()}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-6 py-3 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-lg hover:shadow-xl flex items-center space-x-2"
          >
            <Sprout className="h-4 w-4" />
            <span>Plant Idea</span>
          </button>
        </div>
      </form>
    </div>
  )
}
