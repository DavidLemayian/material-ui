import * as React from 'react';
import { useForkRef } from '@material-ui/core/utils';
import { WrapperVariantContext } from './WrapperVariantContext';
import { KeyboardDateInput } from '../KeyboardDateInput';
import { executeInTheNextEventLoopTick } from '../utils';
import PickersPopper from '../PickersPopper';
import { PrivateWrapperProps } from './WrapperProps';
import { DesktopWrapperProps } from './DesktopWrapper';

const DesktopTooltipWrapper: React.FC<PrivateWrapperProps & DesktopWrapperProps> = (props) => {
  const {
    children,
    DateInputProps,
    KeyboardDateInputComponent = KeyboardDateInput,
    onDismiss,
    open,
    PopperProps,
    TransitionComponent,
  } = props;
  const inputContainerRef = React.useRef<HTMLDivElement>(null);
  const popperRef = React.useRef<HTMLDivElement>(null);

  const handleBlur = () => {
    executeInTheNextEventLoopTick(() => {
      if (
        inputContainerRef.current?.contains(document.activeElement) ||
        popperRef.current?.contains(document.activeElement)
      ) {
        return;
      }

      onDismiss();
    });
  };

  const inputComponentRef = useForkRef(DateInputProps.ref, inputContainerRef);

  return (
    <WrapperVariantContext.Provider value="desktop">
      <KeyboardDateInputComponent {...DateInputProps} ref={inputComponentRef} onBlur={handleBlur} />
      <PickersPopper
        role="tooltip"
        open={open}
        containerRef={popperRef}
        anchorEl={inputContainerRef.current}
        TransitionComponent={TransitionComponent}
        PopperProps={PopperProps}
        onBlur={handleBlur}
        onClose={onDismiss}
      >
        {children}
      </PickersPopper>
    </WrapperVariantContext.Provider>
  );
};

export default DesktopTooltipWrapper;
