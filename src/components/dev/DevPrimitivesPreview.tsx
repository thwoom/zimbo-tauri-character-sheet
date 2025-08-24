import { AnimatePresence, motion } from 'framer-motion';
import React from 'react';
import { useMotionTransition, useMotionVariants } from '../../motion/reduced';
import { durations, easings, fadeScale } from '../../motion/tokens';
import { Dialog, Tooltip, DropdownMenu, Separator, Slider } from '../ui/primitives';

export default function DevPrimitivesPreview() {
  const [open, setOpen] = React.useState<boolean>(false);
  const [menuOpen, setMenuOpen] = React.useState<boolean>(false);
  const transition = useMotionTransition(durations.sm, easings.standard);
  const variants = useMotionVariants(fadeScale);

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#001114',
        padding: '1rem',
        color: '#7efcf6',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
      }}
    >
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <button
            style={{
              borderRadius: '4px',
              backgroundColor: '#ffa726',
              padding: '0.5rem 1rem',
              color: '#001114',
            }}
          >
            Tooltip
          </button>
        </Tooltip.Trigger>
        <Tooltip.Content
          style={{
            borderRadius: '4px',
            backgroundColor: '#001114',
            padding: '0.5rem',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            color: '#7efcf6',
          }}
        >
          Hello
        </Tooltip.Content>
      </Tooltip.Root>

      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Trigger asChild>
          <button
            style={{
              borderRadius: '4px',
              backgroundColor: '#ffa726',
              padding: '0.5rem 1rem',
              color: '#001114',
            }}
          >
            Open Dialog
          </button>
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
                style={{
                  borderRadius: '4px',
                  backgroundColor: '#001114',
                  padding: '1rem',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                }}
              >
                <Dialog.Title style={{ marginBottom: '0.5rem' }}>Dialog Title</Dialog.Title>
                <Dialog.Description style={{ marginBottom: '1rem' }}>
                  This is a Radix dialog.
                </Dialog.Description>
                <button
                  onClick={() => setOpen(false)}
                  style={{
                    borderRadius: '4px',
                    backgroundColor: '#ffa726',
                    padding: '0.5rem 1rem',
                    color: '#001114',
                  }}
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
          <button
            style={{
              borderRadius: '4px',
              backgroundColor: '#ffa726',
              padding: '0.5rem 1rem',
              color: '#001114',
            }}
          >
            Menu
          </button>
        </DropdownMenu.Trigger>
        <AnimatePresence>
          {menuOpen && (
            <DropdownMenu.Content
              asChild
              forceMount
              style={{
                borderRadius: '4px',
                backgroundColor: '#001114',
                padding: '0.5rem',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                color: '#7efcf6',
              }}
            >
              <motion.div
                variants={variants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={transition}
              >
                <DropdownMenu.Item style={{ padding: '0.5rem 1rem' }}>Item 1</DropdownMenu.Item>
                <DropdownMenu.Item style={{ padding: '0.5rem 1rem' }}>Item 2</DropdownMenu.Item>
                <Separator
                  style={{
                    marginY: '0.5rem',
                    height: '1px',
                    backgroundColor: '#ffa726',
                  }}
                />
                <DropdownMenu.Item style={{ padding: '0.5rem 1rem' }}>Item 3</DropdownMenu.Item>
              </motion.div>
            </DropdownMenu.Content>
          )}
        </AnimatePresence>
      </DropdownMenu.Root>

      <div style={{ width: '16rem' }}>
        <Slider defaultValue={[50]} style={{ marginY: '1rem' }} />
      </div>
    </div>
  );
}
