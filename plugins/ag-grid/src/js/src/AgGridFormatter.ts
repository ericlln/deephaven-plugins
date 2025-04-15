import { DataTypeDefinition } from '@ag-grid-community/core';
import { Formatter, TableUtils } from '@deephaven/jsapi-utils';

export default class AgGridFormatter extends Formatter {
  // Override pre-defined data types/create new ones to match Deephaven types
  cellDataTypeDefinitions: { [cellDataType: string]: DataTypeDefinition } = {
    [TableUtils.dataType.BOOLEAN]: {
      extendsDataType: 'boolean',
      baseDataType: 'boolean',
      valueFormatter: params =>
        this.getFormattedString(
          params.value,
          TableUtils.dataType.BOOLEAN,
          params.colDef.field
        ),
    },
    [TableUtils.dataType.CHAR]: {
      extendsDataType: 'text',
      baseDataType: 'text',
      valueFormatter: params =>
        this.getFormattedString(
          params.value,
          TableUtils.dataType.CHAR,
          params.colDef.field
        ),
    },
    [TableUtils.dataType.DATETIME]: {
      extendsDataType: 'date',
      baseDataType: 'date',
      valueFormatter: params =>
        this.getFormattedString(
          params.value,
          TableUtils.dataType.DATETIME,
          params.colDef.field
        ),
    },
    [TableUtils.dataType.DECIMAL]: {
      extendsDataType: 'number',
      baseDataType: 'number',
      valueFormatter: params =>
        this.getFormattedString(
          params.value,
          TableUtils.dataType.DECIMAL,
          params.colDef.field
        ),
    },
    [TableUtils.dataType.INT]: {
      extendsDataType: 'number',
      baseDataType: 'number',
      valueFormatter: params =>
        this.getFormattedString(
          params.value,
          TableUtils.dataType.INT,
          params.colDef.field
        ),
    },
    [TableUtils.dataType.STRING]: {
      extendsDataType: 'text',
      baseDataType: 'text',
      valueFormatter: params =>
        this.getFormattedString(
          params.value,
          TableUtils.dataType.STRING,
          params.colDef.field
        ),
    },
    [TableUtils.dataType.UNKNOWN]: {
      extendsDataType: 'text',
      baseDataType: 'text',
      valueFormatter: params =>
        this.getFormattedString(
          params.value,
          TableUtils.dataType.UNKNOWN,
          params.colDef.field
        ),
    },
  };
}
