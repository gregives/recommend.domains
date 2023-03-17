import namecheapLogo from "@/images/namecheap.svg";
import domaincomLogo from "@/images/domaincom.svg";
import googleLogo from "@/images/google.svg";
import godaddyLogo from "@/images/godaddy.svg";
import bluehostLogo from "@/images/bluehost.svg";

export const affiliates = [
  {
    id: "NAMECHEAP",
    name: "Namecheap",
    href: "https://www.namecheap.com/domains/registration/results/?domain=",
    logo: namecheapLogo,
    color: "orange",
  },
  {
    id: "DOMAINCOM",
    name: "Domain.com",
    href: "https://www.domain.com/registration/?search=",
    logo: domaincomLogo,
    color: "red",
  },
  {
    id: "GOOGLE",
    name: "Google Domains",
    href: "https://domains.google.com/registrar/search?searchTerm=",
    logo: googleLogo,
    color: "amber",
  },
  {
    id: "GODADDY",
    name: "GoDaddy",
    href: "https://uk.godaddy.com/domainsearch/find?domainToCheck=",
    logo: godaddyLogo,
    color: "teal",
  },
  {
    id: "BLUEHOST",
    name: "bluehost",
    href: "https://www.bluehost.com/registration/?search=",
    logo: bluehostLogo,
    color: "blue",
  },
] as const;
