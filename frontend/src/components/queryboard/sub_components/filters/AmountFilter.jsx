import React, { useState, useEffect } from 'react';
import ReactSlider from 'react-slider';
import '../../../../App.css';

const AmountFilter = ({
  onAmountChange,
  selectedMinAmount,
  selectedMaxAmount,
  minPossible = 0,
  maxPossible = 999999,
}) => {
  // Initialize state with numeric values.
  const [rangeValues, setRangeValues] = useState([
    selectedMinAmount !== '' ? Number(selectedMinAmount) : minPossible,
    selectedMaxAmount !== '' ? Number(selectedMaxAmount) : maxPossible,
  ]);

  // Update local state if parent values change.
  useEffect(() => {
    setRangeValues([
      selectedMinAmount !== '' ? Number(selectedMinAmount) : minPossible,
      selectedMaxAmount !== '' ? Number(selectedMaxAmount) : maxPossible,
    ]);
  }, [selectedMinAmount, selectedMaxAmount, minPossible, maxPossible]);

  // Called while dragging the slider.
  const handleSliderChange = (values) => {
    setRangeValues(values);
  };

  // Called when slider dragging is complete.
  const handleSliderAfterChange = (values) => {
    onAmountChange({ min: values[0], max: values[1] });
  };

  // Update state as the user types in the min value.
  const handleMinInputChange = (e) => {
    const value = Number(e.target.value);
    setRangeValues(([prevMin, prevMax]) => [value, prevMax]);
  };

  // Update state as the user types in the max value.
  const handleMaxInputChange = (e) => {
    const value = Number(e.target.value);
    setRangeValues(([prevMin, prevMax]) => [prevMin, value]);
  };

  // When an input loses focus, update the parent filter.
  const handleInputBlur = () => {
    onAmountChange({ min: rangeValues[0], max: rangeValues[1] });
  };

  return (
    <div>
      <label className="block mb-2 font-semibold">Filter by Amount</label>
      <div className="mb-4">
        <ReactSlider
          className="horizontal-slider"
          thumbClassName="example-thumb"
          trackClassName="example-track"
          min={minPossible}
          max={maxPossible}
          value={rangeValues}
          onChange={handleSliderChange}
          onAfterChange={handleSliderAfterChange}
          ariaLabel={['Lower thumb', 'Upper thumb']}
          pearling
          minDistance={1}
        />
      </div>
      <div className="flex justify-between items-center">
        <input
          type="number"
          value={rangeValues[0]}
          onChange={handleMinInputChange}
          onBlur={handleInputBlur}
          className="w-1/2 rounded p-2 mr-2"
        />
        <input
          type="number"
          value={rangeValues[1]}
          onChange={handleMaxInputChange}
          onBlur={handleInputBlur}
          className="w-1/2 rounded p-2 ml-2 text-right"
        />
      </div>
    </div>
  );
};

export default AmountFilter;
