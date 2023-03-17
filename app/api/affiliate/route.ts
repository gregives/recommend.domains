import { affiliates } from "@/constants/affiliates";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";

export default function affiliate(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const href = searchParams.get("href");

  if (href === null) {
    redirect("/");
  }

  const affiliate = affiliates.find((affiliate) =>
    href.startsWith(affiliate.href)
  );

  if (affiliate?.referral !== undefined) {
    redirect(affiliate.referral + encodeURI(href));
  }

  redirect(href);
}

export const config = {
  runtime: "edge",
};
