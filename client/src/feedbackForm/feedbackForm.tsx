import React, { useState } from "react";



interface feedbackData {
  name: string;
  message: string;
  rating?: string;
}




export const FeedbackForm: React.FC = () => {
  const [form, setForm] = useState<feedbackData>({
    name: "",
    message: "",
    rating: "",
  });

  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");

    setTimeout(() => {
      console.log("Feedback Submitted:", form);
      setStatus("success");
      const stored = JSON.parse(localStorage.getItem("feedbacks") || "[]");
      localStorage.setItem("feedbacks", JSON.stringify([...stored, form]));
      setForm({ name: "", message: "", rating: "" });
    }, 1000);
  };

  return (
    <div className="max-w-lg mx-auto mt-16 p-8 bg-white dark:bg-gray-900 rounded-xl shadow-md font-sans">
      <h2 className="text-2xl font-bold text-center mb-2 text-gray-900 dark:text-gray-100">We’d love your feedback 💬</h2>
      <p className="text-center text-gray-500 mb-6">Help us improve by sharing your thoughts, ideas, or bug reports.</p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <label className="font-medium text-gray-700 dark:text-gray-200">
          Name <span className="text-red-500">*</span>
          <input
            name="name"
            type="text"
            value={form.name}
            onChange={handleChange}
            required
            className="mt-1 p-2 border border-gray-300 dark:border-gray-700 rounded-md focus:ring-2 focus:ring-indigo-400 bg-white dark:bg-gray-800"
          />
        </label>

        <label className="font-medium text-gray-700 dark:text-gray-200">
          Rating (optional)
          <select
            name="rating"
            value={form.rating}
            onChange={handleChange}
            className="mt-1 p-2 border border-gray-300 dark:border-gray-700 rounded-md focus:ring-2 focus:ring-indigo-400 bg-white dark:bg-gray-800"
          >
            <option value="">Select...</option>
            <option value="Excellent">Excellent</option>
            <option value="Good">Good</option>
            <option value="Average">Average</option>
            <option value="Poor">Poor</option>
          </select>
        </label>

        <label className="font-medium text-gray-700 dark:text-gray-200">
          Message <span className="text-red-500">*</span>
          <textarea
            name="message"
            value={form.message}
            onChange={handleChange}
            required
            rows={4}
            placeholder="Share your ideas or suggestions..."
            className="mt-1 p-2 border border-gray-300 dark:border-gray-700 rounded-md focus:ring-2 focus:ring-indigo-400 bg-white dark:bg-gray-800"
          />
        </label>

        <button
          type="submit"
          disabled={status === "submitting"}
          className="mt-2 py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-gray-400"
        >
          {status === "submitting" ? "Submitting..." : "Submit Feedback"}
        </button>

        {status === "success" && (
          <p className="text-green-600 text-center mt-2">✅ Thank you for your feedback!</p>
        )}
        {status === "error" && (
          <p className="text-red-600 text-center mt-2">❌ Something went wrong. Try again.</p>
        )}
      </form>
    </div>
  );
};

export default FeedbackForm;