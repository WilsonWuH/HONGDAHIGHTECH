import socialConfig from "../social-links.json";

export default function SocialLinksNext({ floating = false }) {
  return (
    <div className={floating ? "social-float" : "social-links"} aria-label="HDPTH social media links">
      {socialConfig.links.map((item) => (
        <a
          key={item.platform}
          className="social-link"
          href={item.url}
          target={socialConfig.openInNewTab ? "_blank" : undefined}
          rel={socialConfig.openInNewTab ? "noopener noreferrer" : undefined}
          aria-label={item.label}
          title={item.label}
        >
          <span>{item.label.slice(0, 2).toUpperCase()}</span>
        </a>
      ))}
    </div>
  );
}
