import React from "react";
import { DataSource, SourceTypeLabels } from "../types/dataSource";
import './DataSourceOptions.css';

interface DataSourceOptionsProps {
    dataSource: DataSource;
    handleDataSourceChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const DataSourceOptions: React.FC<DataSourceOptionsProps> = ({ dataSource, handleDataSourceChange }) => (
    <div className="data-options-container">
        <fieldset
            className="data-options-fieldset"
            role="radiogroup"
            aria-labelledby="autocomplete-title"
        >
            <legend className="data-options-legend">
                Please select a data source for your request.
            </legend>
            <div className="data-options-radio-group">

                {/* Maps the available data sources to radio buttons */}
                {Object.values(DataSource).map((type) => {
                    const id = `source-${type}`;
                    return (
                        <label key={type} htmlFor={id}>
                            <input
                                id={id}
                                type="radio"
                                name="source"
                                value={type}
                                checked={dataSource === type}
                                onChange={handleDataSourceChange}
                            />
                            {SourceTypeLabels[type]}
                        </label>
                    );
                })}

            </div>
        </fieldset>
    </div>
);

export default DataSourceOptions;
