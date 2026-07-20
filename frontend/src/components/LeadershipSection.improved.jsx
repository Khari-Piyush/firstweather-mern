import { useState } from "react";
import { Section, SectionLabel, SectionHeading } from "./Layout.improved.jsx";

/* ─── Data ─────────────────────────────────────────────────────────── */

const LEADERSHIP = [
  {
    name: "SUNIL KUMAR",
    title: "P roprietor",
    bio: "Sunil Kumar founded First Weather in 2005 and moved the business into automotive wiper parts in 2008. He has since grown it into a full range of wiper systems — arms, blades, linkages, wheel boxes, motor gears and spares — built to OEM-equivalent quality, making First Weather a trusted one-stop source for body builders, dealers and retailers across India.",
    photo: "/founder-image.webp",
    photoAlt: "Sunil Kumar, Proprietorr of First Weather",
    initials: "SK",
  },
];

/* ─── LeadershipSection ────────────────────────────────────────────── */

const LeadershipSection = () => (
  <Section bg="var(--fw-surface-alt)">
    <div style={{ textAlign: "center", marginBottom: "var(--fw-space-12)" }}>
      <SectionLabel>Leadership</SectionLabel>
      <SectionHeading style={{ margin: "0 auto" }}>
        The People Behind First Weather
      </SectionHeading>
    </div>
    <div style={leaderGrid}>
      {LEADERSHIP.map((person) => (
        <LeaderCard key={person.name} person={person} />
      ))}
    </div>
  </Section>
);

export default LeadershipSection;

/* ─── LeaderCard ───────────────────────────────────────────────────── */

const LeaderCard = ({ person }) => {
  const [imgFailed, setImgFailed] = useState(false);
  const showPhoto = Boolean(person.photo) && !imgFailed;

  return (
    <div style={leaderCard}>
      <div style={avatarWrap}>
        {showPhoto ? (
          <img
            src={person.photo}
            alt={person.photoAlt}
            style={avatarImg}
            loading="lazy"
            decoding="async"
            onError={() => setImgFailed(true)}
          />
        ) : (
          <div style={avatarPlaceholder}>
            <span style={avatarInitials}>{person.initials}</span>
          </div>
        )}
      </div>
      <h3 style={leaderName}>{person.name}</h3>
      <p style={leaderTitle}>{person.title}</p>
      <div style={leaderDivider} />
      <p style={leaderBio}>{person.bio}</p>
    </div>
  );
};

/* ─── Styles ───────────────────────────────────────────────────────── */

const leaderGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(280px, 400px))",
  gap: "var(--fw-space-8)",
  justifyContent: "center",
};

const leaderCard = {
  background: "var(--fw-white)",
  border: "1px solid var(--fw-gray-300)",
  borderRadius: "var(--fw-radius-lg)",
  padding: "var(--fw-space-10)",
  textAlign: "center",
};

const avatarWrap = {
  width: "clamp(120px, 22vw, 180px)",
  height: "clamp(120px, 22vw, 180px)",
  borderRadius: "50%",
  overflow: "hidden",
  margin: "0 auto var(--fw-space-6)",
  border: "1px solid var(--fw-gray-300)",
  boxShadow: "var(--fw-shadow-md)",
  flexShrink: 0,
};

const avatarImg = {
  width: "100%",
  height: "100%",
  objectFit: "cover",
  objectPosition: "center 20%",
  display: "block",
};

const avatarPlaceholder = {
  width: "100%",
  height: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "var(--fw-navy)",
};

const avatarInitials = {
  fontSize: "var(--fw-text-xl)",
  fontWeight: "var(--fw-weight-bold)",
  color: "var(--fw-white)",
  letterSpacing: "0.05em",
};

const leaderName = {
  fontSize: "var(--fw-text-xl)",
  fontWeight: "var(--fw-weight-bold)",
  color: "var(--fw-navy)",
  letterSpacing: "var(--fw-tracking-tight)",
  margin: "0 0 var(--fw-space-1)",
};

const leaderTitle = {
  fontSize: "var(--fw-text-sm)",
  color: "var(--fw-gray-500)",
  letterSpacing: "var(--fw-tracking-wide)",
  textTransform: "uppercase",
  margin: 0,
};

const leaderDivider = {
  height: "1px",
  background: "var(--fw-gray-300)",
  margin: "var(--fw-space-6) 0",
};

const leaderBio = {
  fontSize: "var(--fw-text-sm)",
  color: "var(--fw-gray-700)",
  lineHeight: "var(--fw-leading-normal)",
  textAlign: "left",
  margin: 0,
};
