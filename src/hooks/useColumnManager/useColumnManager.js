import { useCallback, useState, useMemo } from 'react';
import { getColumnsForModal } from './helper';

/**
 *  @typedef {object} useColumnManagerReturn
 *
 *  @property {Array}    columns               Patternfly table columns
 *  @property {Function} [columnManagerAction] Action props for a Toolbar action
 *  @property {object}   [ColumnManager]       ColumnManager modal component to be shown to manage columns
 */

/**
 * Provides columns for a Patternfly table, a (Primary)Toolbar action and a `ColumnManager` component
 *
 *  @param   {Array}                  columns                           Columns for a table to be managed
 *  @param   {object}                 [options]                         AsyncTableTools options
 *  @param   {string}                 [options.columnManagerSelectProp] Property to use for the selection manager to identify columns
 *  @param   {string}                 [options.manageColumnLabel]       Label for the action item to show
 *
 *  @returns {useColumnManagerReturn}                                   Props and function to integrate the column manager
 *
 *  @group Hooks
 *
 */
const useColumnManager = (options = {}) => {
  const {
    columns,
    manageColumns: enableColumnManager,
    manageColumnLabel = 'Manage columns',
  } = options;

  const [selectedColumns, setSelectedColumns] = useState(
    columns.filter(({ isShown = true }) => isShown).map(({ title }) => title),
  );
  const [isManagerOpen, setIsManagerOpen] = useState(false);

  const onClick = useCallback(() => {
    setIsManagerOpen(true);
  }, []);

  const onClose = useCallback(() => setIsManagerOpen(false), []);

  const applyColumns = useCallback(
    (columnsToApply) => {
      setSelectedColumns(
        columnsToApply
          .filter(({ isShown }) => isShown)
          .map(({ title }) => title),
      );
      onClose();
    },
    [onClose],
  );

  const columnsToShow = useMemo(
    () =>
      selectedColumns.map((selectedTitle) =>
        columns.find(({ title }) => title === selectedTitle),
      ),
    [selectedColumns, columns],
  );

  const appliedColumns = useMemo(
    () => getColumnsForModal(columns, selectedColumns),
    [columns, selectedColumns],
  );

  return enableColumnManager
    ? {
        columns: columnsToShow,
        columnManagerAction: {
          label: manageColumnLabel,
          onClick,
        },
        columnManagerModalProps: {
          appliedColumns,
          isOpen: isManagerOpen,
          onClose,
          applyColumns: applyColumns,
        },
      }
    : { columns };
};

export default useColumnManager;
