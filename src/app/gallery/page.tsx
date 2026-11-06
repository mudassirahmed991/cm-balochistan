import type { Metadata } from "next";
import { db } from "@/lib/db";
import { Container, PageHero } from "@/components/ui";
import { GalleryGrid } from "@/components/gallery/gallery-grid";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Official Media & Video Gallery | Chief Minister of Balochistan",
  description:
    "Official high-definition photo and video gallery of the Government of Balochistan — official ceremonies, development progress, and cabinet proceedings.",
};

export default function GalleryPage() {
  const items = db.gallery.findAll();

  return (
    <main id="main-content">
      {/* 3D Glass Hero Banner */}
      <PageHero
        eyebrow="Media Directorate & Visual Archives"
        title="Official Photo & Video Gallery"
        description="Comprehensive visual archive of executive events, cabinet proceedings, provincial infrastructure milestones, and public welfare initiatives."
        crumbs={[{ label: "Media Gallery" }]}
      />

      {/* Gallery Main Interactive Section */}
      <section className="py-12 sm:py-16">
        <Container>
          <GalleryGrid initialItems={items} allowUpload={false} />
        </Container>
      </section>
    </main>
  );
}
