import namecheapLogo from "@/images/namecheap.svg";
import domaincomLogo from "@/images/domaincom.svg";
import googleLogo from "@/images/google.svg";
import godaddyLogo from "@/images/godaddy.svg";
import bluehostLogo from "@/images/bluehost.svg";
import shopifyLogo from "@/images/shopify.svg";

export const affiliates = [
  {
    id: "NAMECHEAP",
    name: "Namecheap",
    href: "https://www.namecheap.com/domains/registration/results/?domain=",
    referral: process.env.NAMECHEAP_REFERRAL_LINK,
    logo: namecheapLogo,
    bg: "from-orange-100 to-orange-200 hover:from-orange-200 hover:to-orange-300",
  },
  {
    id: "BLUEHOST",
    name: "bluehost",
    href: "https://www.bluehost.com/registration/?search=",
    referral: process.env.BLUEHOST_REFERRAL_LINK,
    logo: bluehostLogo,
    bg: "from-blue-100 to-blue-200 hover:from-blue-200 hover:to-blue-300",
  },
  {
    id: "DOMAINCOM",
    name: "Domain.com",
    href: "https://www.domain.com/registration/?search=",
    referral: process.env.DOMAINCOM_REFERRAL_LINK,
    logo: domaincomLogo,
    bg: "from-red-100 to-red-200 hover:from-red-200 hover:to-red-300",
  },
  {
    id: "SHOPIFY",
    name: "Shopify",
    href: "https://www.shopify.com/tools/domain-name-generator/search?query=",
    referral: process.env.SHOPIFY_REFERRAL_LINK,
    logo: shopifyLogo,
    bg: "from-lime-100 to-lime-200 hover:from-lime-200 hover:to-lime-300",
  },
  {
    id: "GOOGLE",
    name: "Google Domains",
    href: "https://domains.google.com/registrar/search?searchTerm=",
    referral: process.env.GOOGLE_REFERRAL_LINK,
    logo: googleLogo,
    bg: "from-amber-100 to-amber-200 hover:from-amber-200 hover:to-amber-300",
  },
  {
    id: "GODADDY",
    name: "GoDaddy",
    href: "https://uk.godaddy.com/domainsearch/find?domainToCheck=",
    referral: process.env.GODADDY_REFERRAL_LINK,
    logo: godaddyLogo,
    bg: "from-teal-100 to-teal-200 hover:from-teal-200 hover:to-teal-300",
  },
] as const;
