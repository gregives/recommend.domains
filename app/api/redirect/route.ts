import { affiliates } from "@/constants/affiliates";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const encodedHref = searchParams.get("href");

  if (encodedHref === null) {
    redirect("/");
  }

  const decodedHref = decodeURIComponent(encodedHref);

  const affiliate = affiliates.find((affiliate) =>
    decodedHref.startsWith(affiliate.href)
  );

  if (affiliate?.referral !== undefined) {
    redirect(affiliate.referral + encodeURI(decodedHref));
  }

  redirect(decodedHref);
}

export const runtime = "edge";
