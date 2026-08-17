"use client";

import { useEditorStore } from "./editor-context";
import { HeroForm } from "./forms/HeroForm";
import { FeaturesForm } from "./forms/FeaturesForm";
import { PricingForm } from "./forms/PricingForm";
import { GalleryForm } from "./forms/GalleryForm";
import { BeforeAfterForm } from "./forms/BeforeAfterForm";
import { MenuForm } from "./forms/MenuForm";
import { ContactForm } from "./forms/ContactForm";
import { FooterForm } from "./forms/FooterForm";
import type {
  HeroContent,
  FeaturesContent,
  PricingContent,
  GalleryContent,
  BeforeAfterContent,
  MenuContent,
  ContactContent,
  FooterContent,
} from "@/validation/blocks";

export function BlockEditorPanel() {
  const blocks = useEditorStore((s) => s.blocks);
  const selectedBlockId = useEditorStore((s) => s.selectedBlockId);
  const block = blocks.find((b) => b.id === selectedBlockId);

  if (!block) {
    return (
      <p className="text-sm text-neutral-500">
        Sélectionnez une section à gauche pour la modifier.
      </p>
    );
  }

  // key={block.id} forces a remount (and fresh defaultValues) when the
  // selected block changes — react-hook-form only reads defaultValues once.
  switch (block.blockType) {
    case "hero":
      return <HeroForm key={block.id} blockId={block.id} defaultValues={block.content as HeroContent} />;
    case "features":
      return (
        <FeaturesForm key={block.id} blockId={block.id} defaultValues={block.content as FeaturesContent} />
      );
    case "pricing":
      return (
        <PricingForm key={block.id} blockId={block.id} defaultValues={block.content as PricingContent} />
      );
    case "gallery":
      return (
        <GalleryForm key={block.id} blockId={block.id} defaultValues={block.content as GalleryContent} />
      );
    case "beforeAfter":
      return (
        <BeforeAfterForm
          key={block.id}
          blockId={block.id}
          defaultValues={block.content as BeforeAfterContent}
        />
      );
    case "menu":
      return <MenuForm key={block.id} blockId={block.id} defaultValues={block.content as MenuContent} />;
    case "contact":
      return (
        <ContactForm key={block.id} blockId={block.id} defaultValues={block.content as ContactContent} />
      );
    case "footer":
      return <FooterForm key={block.id} blockId={block.id} defaultValues={block.content as FooterContent} />;
    default:
      return null;
  }
}
