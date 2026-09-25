import { Link } from 'react-router-dom';
import { LegalLayout } from './LegalLayout';

export function TermsPage() {
  return (
    <LegalLayout
      title="Terms of use"
      description="The terms for using Journey Through Ladakh, an editorial travel guide."
      path="/terms"
      updated="26 September 2026"
      intro="By using this site you agree to these terms. They are short, and they matter most where your safety is concerned."
    >
      <section>
        <h2>What this site is</h2>
        <p className="mt-3">
          Journey Through Ladakh is a travel guide with a booking-request service. Our routes and packages are guides you
          can follow yourself, and you can also send us a booking request for any of them. A request is not a booking:
          no payment is taken on this site, and nothing is confirmed until we confirm it to you directly, in writing,
          after which the price, what is included and any payment or cancellation terms will be agreed with you. We do
          not obtain permits on your behalf unless we tell you so in that confirmation.
        </p>
      </section>

      <section>
        <h2>Travel carries risk</h2>
        <ul className="mt-3">
          <li>Ladakh is high, remote and seasonal. Altitude, weather, roads and permit rules can change quickly and without notice.</li>
          <li>Information here — including AI answers — may be incomplete or out of date. Always confirm permits, road conditions, health advice and safety details with an official local source before you travel.</li>
          <li>You are responsible for your own decisions, health, insurance and safety. Nothing here is medical advice.</li>
        </ul>
      </section>

      <section>
        <h2>Booking requests</h2>
        <ul className="mt-3">
          <li>Give accurate contact details and travel dates so we can reach you.</li>
          <li>A request only tells us what you are interested in. It does not reserve anything or oblige either of us.</li>
          <li>Availability, prices and conditions are confirmed with you individually and can change until then.</li>
        </ul>
      </section>

      <section>
        <h2>Your account</h2>
        <p className="mt-3">
          Give accurate details and keep your password private. You are responsible for what happens under your
          account. We may suspend accounts that are used to abuse the service.
        </p>
      </section>

      <section>
        <h2>Your itineraries</h2>
        <p className="mt-3">
          Itineraries you create are yours. By saving one, you let us store it and show it to the people you choose:
          only you if private, or anyone with the link if unlisted or public. You can delete it at any time.
        </p>
      </section>

      <section>
        <h2>Acceptable use</h2>
        <ul className="mt-3">
          <li>Do not attempt to break, overload or gain unauthorised access to the site.</li>
          <li>Do not use the contact form or AI guide to send spam or unlawful content.</li>
          <li>Do not scrape the site at a rate that harms it.</li>
        </ul>
      </section>

      <section>
        <h2>Photographs and other content</h2>
        <p className="mt-3">
          Photographs are used under their free licences (CC BY or CC BY-SA) and remain the work of their
          photographers; each licence and source is on the <Link to="/credits" className="text-accent hover:underline">credits page</Link>.
          Map data is © OpenStreetMap contributors. Please do not copy our written content wholesale without asking.
        </p>
      </section>

      <section>
        <h2>No warranty and limits on liability</h2>
        <p className="mt-3">
          The site is provided "as is" without warranties of any kind. To the extent the law allows, we are not
          liable for losses arising from your use of the site or from relying on its information.
        </p>
      </section>

      <section>
        <h2>Changes</h2>
        <p className="mt-3">We may update these terms. Continuing to use the site after a change means you accept the new version.</p>
      </section>
    </LegalLayout>
  );
}
