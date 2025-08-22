import { AnimatePresence, motion } from 'framer-motion';
import React from 'react';
import { useMotionTransition, useMotionVariants } from '../../motion/reduced';
import { durations, easings, fadeScale } from '../../motion/tokens';
import { css } from '../../styled-system/css';
import { Dialog, Tooltip, DropdownMenu, Separator, Slider } from '../ui/primitives';

export default function DevPrimitivesPreview() {
  const [open, setOpen] = React.useState<boolean>(false);
  const [menuOpen, setMenuOpen] = React.useState<boolean>(false);
  const transition = useMotionTransition(durations.sm, easings.standard);
  const variants = useMotionVariants(fadeScale);

  return (
    <div className={css({
      minHeight: '100vh',
      backgroundColor: 'background',
      padding: 'md',
      color: 'text',
      display: 'flex',
      flexDirection: 'column',
      gap: 'md'
    })}>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <button className={css({
            borderRadius: 'md',
            backgroundColor: 'accent',
            paddingX: 'md',
            paddingY: 'sm',
            color: 'background'
          })}>Tooltip</button>
        </Tooltip.Trigger>
        <Tooltip.Content className={css({
          borderRadius: 'md',
          backgroundColor: 'background',
          paddingX: 'sm',
          paddingY: 'sm',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          color: 'text'
        })}>
          Hello
        </Tooltip.Content>
      </Tooltip.Root>

      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Trigger asChild>
          <button className={css({
            borderRadius: 'md',
            backgroundColor: 'accent',
            paddingX: 'md',
            paddingY: 'sm',
            color: 'background'
          })}>Open Dialog</button>
        </Dialog.Trigger>
        <AnimatePresence>
          {open && (
            <Dialog.Content asChild forceMount>
              <motion.div
                variants={variants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={transition}
                className={css({
                  borderRadius: 'md',
                  backgroundColor: 'background',
                  padding: 'md',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                })}
              >
                <Dialog.Title className={css({ marginBottom: 'sm' })}>Dialog Title</Dialog.Title>
                <Dialog.Description className={css({ marginBottom: 'md' })}>This is a Radix dialog.</Dialog.Description>
                <button
                  onClick={() => setOpen(false)}
                  className={css({
                    borderRadius: 'md',
                    backgroundColor: 'accent',
                    paddingX: 'md',
                    paddingY: 'sm',
                    color: 'background'
                  })}
                >
                  Close
                </button>
              </motion.div>
            </Dialog.Content>
          )}
        </AnimatePresence>
      </Dialog.Root>

      <DropdownMenu.Root open={menuOpen} onOpenChange={setMenuOpen}>
        <DropdownMenu.Trigger asChild>
          <button className={css({
            borderRadius: 'md',
            backgroundColor: 'accent',
            paddingX: 'md',
            paddingY: 'sm',
            color: 'background'
          })}>Menu</button>
        </DropdownMenu.Trigger>
        <AnimatePresence>
          {menuOpen && (
            <DropdownMenu.Content asChild forceMount className={css({
              borderRadius: 'md',
              backgroundColor: 'background',
              padding: 'sm',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              color: 'text'
            })}>
              <motion.div
                variants={variants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={transition}
              >
                <DropdownMenu.Item className={css({ paddingX: 'md', paddingY: 'sm' })}>Item 1</DropdownMenu.Item>
                <DropdownMenu.Item className={css({ paddingX: 'md', paddingY: 'sm' })}>Item 2</DropdownMenu.Item>
                <Separator className={css({ 
                  marginY: 'sm',
                  height: '1px',
                  backgroundColor: 'accent'
                })} />
                <DropdownMenu.Item className={css({ paddingX: 'md', paddingY: 'sm' })}>Item 3</DropdownMenu.Item>
              </motion.div>
            </DropdownMenu.Content>
          )}
        </AnimatePresence>
      </DropdownMenu.Root>

      <div className={css({ width: '16rem' })}>
        <Slider defaultValue={[50]} className={css({ marginY: 'md' })} />
      </div>
    </div>
  );
}
