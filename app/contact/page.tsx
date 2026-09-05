import { Announcement, Footer, SiteHeader } from "@/components/shell";
import { Container, Heading, Section } from "@/components/ui";

export default function ContactPage() {
  return <main><Announcement /><SiteHeader /><Section><Container><p className="eyebrow">Contact</p><Heading as="h1">Get in<br />touch.</Heading><p>Contact details and support options are coming soon.</p></Container></Section><Footer /></main>;
}
