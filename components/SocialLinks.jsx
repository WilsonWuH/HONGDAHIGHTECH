const socialLinks = [
  { platform: "Facebook", url: "https://www.facebook.com/hdpth" },
  { platform: "Instagram", url: "https://www.instagram.com/hdpth" },
  { platform: "LinkedIn", url: "https://www.linkedin.com/company/hdpth" }
];

export default function SocialLinks({ floating = false }) {
  return (
    <div className={floating ? "social-float" : "social-links"} aria-label="HDPTH social media links">
      {socialLinks.map((item) => (
        <a
          key={item.platform}
          className="social-link"
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={item.platform}
          title={item.platform}
        >
          {item.platform.slice(0, 2).toUpperCase()}
        </a>
      ))}
    </div>
  );
}
