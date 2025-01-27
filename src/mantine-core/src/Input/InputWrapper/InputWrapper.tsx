import React, { forwardRef, Fragment } from 'react';
import { DefaultProps, MantineSize, Selectors, useComponentDefaultProps } from '@mantine/styles';
import { Box } from '../../Box';
import { InputLabel, InputLabelStylesNames } from '../InputLabel/InputLabel';
import { InputError, InputErrorStylesNames } from '../InputError/InputError';
import {
  InputDescription,
  InputDescriptionStylesNames,
} from '../InputDescription/InputDescription';
import { InputWrapperProvider } from '../InputWrapper.context';
import { getInputOffsets } from './get-input-offsets';
import useStyles from './InputWrapper.styles';

export type InputWrapperStylesNames =
  | Selectors<typeof useStyles>
  | InputLabelStylesNames
  | InputErrorStylesNames
  | InputDescriptionStylesNames;

export interface InputWrapperBaseProps {
  /** Input label, displayed before input */
  label?: React.ReactNode;

  /** Input description, displayed after label */
  description?: React.ReactNode;

  /** Displays error message after input */
  error?: React.ReactNode;

  /** Adds red asterisk on the right side of label */
  required?: boolean;

  /** Props spread to label element */
  labelProps?: Record<string, any>;

  /** Props spread to description element */
  descriptionProps?: Record<string, any>;

  /** Props spread to error element */
  errorProps?: Record<string, any>;

  /** Input container component, defaults to React.Fragment */
  inputContainer?(children: React.ReactNode): React.ReactNode;

  /** Controls order of the Input.Wrapper elements */
  inputWrapperOrder?: ('label' | 'input' | 'description' | 'error')[];
}

export interface InputWrapperProps
  extends DefaultProps<InputWrapperStylesNames>,
    InputWrapperBaseProps,
    React.ComponentPropsWithoutRef<'div'> {
  /** Input that should be wrapped */
  children: React.ReactNode;

  /** htmlFor label prop */
  id?: string;

  /** Render label as label with htmlFor or as div */
  labelElement?: 'label' | 'div';

  /** Controls all elements font-size */
  size?: MantineSize;

  /** Static css selector base */
  __staticSelector?: string;
}

const defaultProps: Partial<InputWrapperProps> = {
  labelElement: 'label',
  size: 'sm',
  inputContainer: (children) => children,
  inputWrapperOrder: ['label', 'description', 'input', 'error'],
};

export const InputWrapper = forwardRef<HTMLDivElement, InputWrapperProps>((props, ref) => {
  const {
    className,
    label,
    children,
    required,
    id,
    error,
    description,
    labelElement,
    labelProps,
    descriptionProps,
    errorProps,
    classNames,
    styles,
    size,
    inputContainer,
    __staticSelector,
    unstyled,
    inputWrapperOrder,
    ...others
  } = useComponentDefaultProps('InputWrapper', defaultProps, props);

  const { classes, cx } = useStyles(null, {
    classNames,
    styles,
    name: ['InputWrapper', __staticSelector],
    unstyled,
  });

  const sharedProps = {
    classNames,
    styles,
    unstyled,
    size,
    __staticSelector,
  };

  const _label = label && (
    <InputLabel
      key="label"
      labelElement={labelElement}
      id={id ? `${id}-label` : undefined}
      htmlFor={id}
      required={required}
      {...sharedProps}
      {...labelProps}
    >
      {label}
    </InputLabel>
  );

  const _description = description && (
    <InputDescription key="description" {...sharedProps} {...descriptionProps}>
      {description}
    </InputDescription>
  );

  const _input = <Fragment key="input">{inputContainer(children)}</Fragment>;

  const _error = typeof error !== 'boolean' && error && (
    <InputError {...errorProps} key="error" {...sharedProps}>
      {error}
    </InputError>
  );

  const content = inputWrapperOrder.map((part) => {
    switch (part) {
      case 'label':
        return _label;
      case 'input':
        return _input;
      case 'description':
        return _description;
      case 'error':
        return _error;
      default:
        return null;
    }
  });

  return (
    <InputWrapperProvider
      value={getInputOffsets(inputWrapperOrder, {
        hasDescription: !!_description,
        hasError: !!_error,
      })}
    >
      <Box className={cx(classes.root, className)} ref={ref} {...others}>
        {content}
      </Box>
    </InputWrapperProvider>
  );
});

InputWrapper.displayName = '@mantine/core/InputWrapper';
