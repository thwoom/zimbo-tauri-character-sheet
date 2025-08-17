import React from 'react';
import { Dialog, Tooltip, DropdownMenu, Separator, Slider } from '../ui/primitives';

export default function DevPrimitivesPreview() {
  const [open, setOpen] = React.useState<boolean>(false);

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
        <Dialog.Content className="rounded bg-bg p-md shadow">
          <Dialog.Title className="mb-sm">Dialog Title</Dialog.Title>
          <Dialog.Description className="mb-md">This is a Radix dialog.</Dialog.Description>
          <button onClick={() => setOpen(false)} className="rounded bg-accent px-md py-sm text-bg">
            Close
          </button>
        </Dialog.Content>
      </Dialog.Root>

      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <button className="rounded bg-accent px-md py-sm text-bg">Menu</button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content className="rounded bg-bg p-sm shadow text-fg">
          <DropdownMenu.Item className="px-md py-sm">Item 1</DropdownMenu.Item>
          <DropdownMenu.Item className="px-md py-sm">Item 2</DropdownMenu.Item>
          <Separator className="my-sm h-px bg-accent" />
          <DropdownMenu.Item className="px-md py-sm">Item 3</DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Root>

      <div className="w-64">
        <Slider defaultValue={[50]} className="my-md" />
      </div>
    </div>
  );
}
