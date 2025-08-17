import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import React from 'react';
import { durations, easings, fadeScale } from '../../motion/tokens';
import { Dialog, Tooltip, DropdownMenu, Separator, Slider } from '../ui/primitives';

export default function DevPrimitivesPreview() {
  const [open, setOpen] = React.useState<boolean>(false);
  const [menuOpen, setMenuOpen] = React.useState<boolean>(false);
  const reduce = useReducedMotion();
  const transition = reduce ? { duration: 0 } : { duration: durations.sm, ease: easings.standard };
  const variants = reduce
    ? { hidden: { opacity: 0 }, visible: { opacity: 1 }, exit: { opacity: 0 } }
    : fadeScale;

  return (
    <div className="min-h-screen bg-bg p-md text-fg space-y-md">
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <button className="rounded bg-accent px-md py-sm text-bg">Tooltip</button>
        </Tooltip.Trigger>
        <Tooltip.Content className="rounded bg-bg px-sm py-sm shadow text-fg">
          Hello
        </Tooltip.Content>
      </Tooltip.Root>

      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Trigger asChild>
          <button className="rounded bg-accent px-md py-sm text-bg">Open Dialog</button>
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
                className="rounded bg-bg p-md shadow"
              >
                <Dialog.Title className="mb-sm">Dialog Title</Dialog.Title>
                <Dialog.Description className="mb-md">This is a Radix dialog.</Dialog.Description>
                <button
                  onClick={() => setOpen(false)}
                  className="rounded bg-accent px-md py-sm text-bg"
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
          <button className="rounded bg-accent px-md py-sm text-bg">Menu</button>
        </DropdownMenu.Trigger>
        <AnimatePresence>
          {menuOpen && (
            <DropdownMenu.Content asChild forceMount className="rounded bg-bg p-sm shadow text-fg">
              <motion.div
                variants={variants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={transition}
              >
                <DropdownMenu.Item className="px-md py-sm">Item 1</DropdownMenu.Item>
                <DropdownMenu.Item className="px-md py-sm">Item 2</DropdownMenu.Item>
                <Separator className="my-sm h-px bg-accent" />
                <DropdownMenu.Item className="px-md py-sm">Item 3</DropdownMenu.Item>
              </motion.div>
            </DropdownMenu.Content>
          )}
        </AnimatePresence>
      </DropdownMenu.Root>

      <div className="w-64">
        <Slider defaultValue={[50]} className="my-md" />
      </div>
    </div>
  );
}
