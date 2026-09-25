import { Link } from 'react-router-dom';
import { LegalLayout } from './LegalLayout';

export function PrivacyPage() {
  return (
    <LegalLayout
      title="Privacy notice"
      description="What Journey Through Ladakh collects, why, who else sees it and the choices you have."
      path="/privacy"
      updated="26 September 2026"
      intro="We collect as little as we need to run the site. This page explains what that is, what we do with it and how to ask us to change or delete it."
    >
      <section>
        <h2>What we collect</h2>
        <ul className="mt-3">
          <li>
            <strong>If you create an account:</strong> a username, your email address and a password. The password is stored only as a salted hash, never in readable form.
          </li>
          <li>
            <strong>Itineraries you save:</strong> the trip name, days, notes and places you add, and whether you share it (private, unlisted or public).
          </li>
          <li>
            <strong>If you send a booking request:</strong> your name, email, phone number, preferred dates, group size, where you are travelling from and any notes you add. We use these only to contact you about that request.
          </li>
          <li>
            <strong>If you contact us:</strong> your name, email, the topic and your message. We do not store your IP address with it.
          </li>
          <li>
            <strong>If you use the AI guide:</strong> the questions you type are sent to our AI provider (Google's Gemini service) so it can write an answer. The conversation is not saved to our database.
          </li>
        </ul>
        <p className="mt-3">Browsing the site, using the planner without saving, and reading guides needs no account and stores nothing about you on our side.</p>
      </section>

      <section>
        <h2>Cookies and browser storage</h2>
        <ul className="mt-3">
          <li>One essential cookie keeps you logged in. It is marked httpOnly and same-site so scripts and other sites cannot read it, and it is removed when you log out.</li>
          <li>If you build an itinerary while logged out and choose to save, your browser briefly keeps the draft in session storage so it survives the trip to the login page. It is cleared when the tab closes.</li>
          <li>We do not use advertising or analytics cookies.</li>
        </ul>
      </section>

      <section>
        <h2>Other services your browser contacts</h2>
        <p className="mt-3">
          To display pages, your browser fetches fonts from Google Fonts, map styles from unpkg, and map tiles from
          OpenStreetMap. As with any web request, those services can see your IP address and browser details. Photographs
          are hosted on this site. Each photo's source is listed on the <Link to="/credits" className="text-accent hover:underline">credits page</Link>.
        </p>
      </section>

      <section>
        <h2>How we use it</h2>
        <ul className="mt-3">
          <li>To provide the features you use — accounts, saved trips and the AI guide.</li>
          <li>To reply to your messages and fix mistakes you report.</li>
          <li>To keep the service secure and prevent abuse, such as limiting repeated contact-form submissions.</li>
        </ul>
        <p className="mt-3">We do not sell your information.</p>
      </section>

      <section>
        <h2>Keeping and deleting it</h2>
        <p className="mt-3">
          We keep account data until you ask us to delete it, and contact messages and booking requests until they have been handled. You can
          delete any itinerary yourself from its page. To see, correct or delete your account, messages or booking requests, write to us via
          the <Link to="/contact" className="text-accent hover:underline">contact form</Link>.
        </p>
      </section>

      <section>
        <h2>Changes</h2>
        <p className="mt-3">If we change how we handle data, we will update this page and its date.</p>
      </section>
    </LegalLayout>
  );
}
