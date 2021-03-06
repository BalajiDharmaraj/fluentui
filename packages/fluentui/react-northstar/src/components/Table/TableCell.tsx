import * as customPropTypes from '@fluentui/react-proptypes';
import { Accessibility, tableCellBehavior, TableCellBehaviorProps } from '@fluentui/accessibility';
import { Ref } from '@fluentui/react-component-ref';
import * as PropTypes from 'prop-types';
import * as React from 'react';
import * as _ from 'lodash';
import {
  childrenExist,
  ChildrenComponentProps,
  commonPropTypes,
  ContentComponentProps,
  createShorthandFactory,
  UIComponentProps,
} from '../../utils';
import { useTelemetry, useStyles, getElementType, useUnhandledProps, useAccessibility } from '@fluentui/react-bindings';
// @ts-ignore
import { ThemeContext } from 'react-fela';
import Box, { BoxProps } from '../Box/Box';
import {
  WithAsProp,
  ShorthandValue,
  withSafeTypeForAs,
  FluentComponentStaticProps,
  ProviderContextPrepared,
} from '../../types';

export interface TableCellProps
  extends UIComponentProps,
    ChildrenComponentProps,
    ContentComponentProps<ShorthandValue<BoxProps>> {
  /**
   * Accessibility behavior if overridden by the user.
   * @available TableCellBehavior
   * */
  accessibility?: Accessibility<TableCellBehaviorProps>;

  /**
   * Truncate cell's content
   */
  truncateContent?: boolean;
}

export type TableCellStylesProps = Pick<TableCellProps, 'truncateContent'>;

export interface TableCellSlotClassNames {
  content: string;
}

const TableCell: React.FC<WithAsProp<TableCellProps>> &
  FluentComponentStaticProps<TableCellProps> & {
    slotClassNames: TableCellSlotClassNames;
  } = props => {
  const context: ProviderContextPrepared = React.useContext(ThemeContext);
  const { setStart, setEnd } = useTelemetry(TableCell.displayName, context.telemetry);
  setStart();
  const cellRef = React.useRef<HTMLElement>();

  const { children, content, truncateContent, className, design, styles, variables } = props;
  const hasChildren = childrenExist(children);
  const ElementType = getElementType(props);
  const unhandledProps = useUnhandledProps(TableCell.handledProps, props);
  const getA11yProps = useAccessibility(props.accessibility, {
    debugName: TableCell.displayName,
    actionHandlers: {
      focusCell: e => {
        e.preventDefault();
        cellRef.current.focus();
      },
      performClick: e => {
        handleClick(e);
      },
    },
    rtl: context.rtl,
  });

  const { classes, styles: resolvedStyles } = useStyles<TableCellStylesProps>(TableCell.displayName, {
    className: TableCell.className,
    mapPropsToStyles: () => ({
      truncateContent,
    }),
    mapPropsToInlineStyles: () => ({
      className,
      design,
      styles,
      variables,
    }),
    rtl: context.rtl,
  });

  const handleClick = (e: React.MouseEvent | React.KeyboardEvent) => {
    if (e.currentTarget === e.target) {
      _.invoke(props, 'onClick', e, props);
      e.preventDefault();
    }
  };

  const element = (
    <Ref innerRef={cellRef}>
      {getA11yProps.unstable_wrapWithFocusZone(
        <ElementType
          {...getA11yProps('root', {
            className: classes.root,
            onClick: handleClick,
            ...unhandledProps,
          })}
        >
          {hasChildren
            ? children
            : Box.create(content, {
                defaultProps: () => ({ styles: resolvedStyles.content }),
              })}
        </ElementType>,
      )}
    </Ref>
  );
  setEnd();
  return element;
};

TableCell.displayName = 'TableCell';

TableCell.className = 'ui-table__cell';

TableCell.slotClassNames = {
  content: `${TableCell.className}__content`,
};

TableCell.propTypes = {
  ...commonPropTypes.createCommon({
    content: false,
  }),
  content: customPropTypes.every([
    customPropTypes.disallow(['children']),
    PropTypes.oneOfType([PropTypes.arrayOf(customPropTypes.nodeContent), customPropTypes.nodeContent]),
  ]),
  truncateContent: PropTypes.bool,
};

TableCell.handledProps = Object.keys(TableCell.propTypes) as any;

TableCell.defaultProps = {
  accessibility: tableCellBehavior,
};

TableCell.create = createShorthandFactory({ Component: TableCell, mappedProp: 'content' });

/**
 * Component represents a table cell
 */
export default withSafeTypeForAs<typeof TableCell, TableCellProps, 'div'>(TableCell);
