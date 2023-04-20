import namecheapLogo from "@/images/namecheap.svg";
import domaincomLogo from "@/images/domaincom.svg";
import googleLogo from "@/images/google.svg";
import godaddyLogo from "@/images/godaddy.svg";
import bluehostLogo from "@/images/bluehost.svg";
import shopifyLogo from "@/images/shopify.svg";
import hostingerLogo from "@/images/hostinger.svg";

export const affiliates = [
  {
    id: "NAMECHEAP",
    name: "Namecheap",
    href: "https://www.namecheap.com/domains/registration/results/?domain=",
    referral: process.env.NAMECHEAP_REFERRAL_LINK,
    logo: namecheapLogo,
    className:
      "from-orange-100 to-orange-200 hover:from-orange-200 hover:to-orange-300 focus-visible:outline-orange-600",
  },
  {
    id: "DOMAINCOM",
    name: "Domain.com",
    href: "https://www.domain.com/registration/?search=",
    referral: process.env.DOMAINCOM_REFERRAL_LINK,
    logo: domaincomLogo,
    className:
      "from-red-100 to-red-200 hover:from-red-200 hover:to-red-300 focus-visible:outline-red-600",
  },
  {
    id: "HOSTINGER",
    name: "Hostinger",
    href: "https://www.hostinger.co.uk/domain-name-search?REFERRALCODE=1GREG48&domain=",
    referral: process.env.HOSTINGER_REFERRAL_LINK,
    logo: hostingerLogo,
    className:
      "from-purple-100 to-purple-200 hover:from-purple-200 hover:to-purple-300 focus-visible:outline-purple-600",
  },
  {
    id: "SHOPIFY",
    name: "Shopify",
    href: "https://www.shopify.com/tools/domain-name-generator/search?query=",
    referral: process.env.SHOPIFY_REFERRAL_LINK,
    logo: shopifyLogo,
    className:
      "from-lime-100 to-lime-200 hover:from-lime-200 hover:to-lime-300 focus-visible:outline-lime-600",
  },
  {
    id: "BLUEHOST",
    name: "bluehost",
    href: "https://www.bluehost.com/registration/?search=",
    referral: process.env.BLUEHOST_REFERRAL_LINK,
    logo: bluehostLogo,
    className:
      "from-blue-100 to-blue-200 hover:from-blue-200 hover:to-blue-300 focus-visible:outline-blue-600",
  },
  {
    id: "GOOGLE",
    name: "Google Domains",
    href: "https://domains.google.com/registrar/search?searchTerm=",
    referral: process.env.GOOGLE_REFERRAL_LINK,
    logo: googleLogo,
    className:
      "from-amber-100 to-amber-200 hover:from-amber-200 hover:to-amber-300 focus-visible:outline-amber-600",
  },
  {
    id: "GODADDY",
    name: "GoDaddy",
    href: "https://uk.godaddy.com/domainsearch/find?domainToCheck=",
    referral: process.env.GODADDY_REFERRAL_LINK,
    logo: godaddyLogo,
    className:
      "from-teal-100 to-teal-200 hover:from-teal-200 hover:to-teal-300 focus-visible:outline-teal-600",
  },
] as const;
