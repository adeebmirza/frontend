function ModelSelector({ models, selectedModel, onChange }) {
    return (
      <div className="flex items-center">
        <label htmlFor="model-select" className="mr-2 text-sm text-gray-700">AI Model:</label>
        <select
          id="model-select"
          value={selectedModel}
          onChange={(e) => onChange(e.target.value)}
          className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
        >
          {models.map((model) => (
            <option key={model} value={model}>
              {model}
            </option>
          ))}
        </select>
      </div>
    );
  }
  
  export default ModelSelector;