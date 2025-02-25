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
  const [rangeValues, setRangeValues] = useState([
    selectedMinAmount !== '' ? selectedMinAmount : minPossible,
    selectedMaxAmount !== '' ? selectedMaxAmount : maxPossible,
  ]);

  useEffect(() => {
    setRangeValues([
      selectedMinAmount !== '' ? selectedMinAmount : minPossible,
      selectedMaxAmount !== '' ? selectedMaxAmount : maxPossible,
    ]);
  }, [selectedMinAmount, selectedMaxAmount, minPossible, maxPossible]);

  const handleChange = (values) => {
    setRangeValues(values);
  };

  const handleAfterChange = (values) => {
    onAmountChange({ min: values[0], max: values[1] });
  };

  return (
    <div>
      <label className="block mb-6 font-semibold">Filter by Amount</label>
      <div className="mb-2">
        <ReactSlider
          className="horizontal-slider"
          thumbClassName="example-thumb"
          trackClassName="example-track"
          min={minPossible}
          max={maxPossible}
          value={rangeValues}
          onChange={handleChange}
          onAfterChange={handleAfterChange}
          ariaLabel={['Lower thumb', 'Upper thumb']}
          pearling
          minDistance={1}
        />
      </div>
      <div className="flex justify-between">
        <span>{rangeValues[0]}</span>
        <span>{rangeValues[1]}</span>
      </div>
    </div>
  );
};

export default AmountFilter;
