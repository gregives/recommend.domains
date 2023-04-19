import { useEffect } from "react";

function shuffleArray<T>(array: T[]): T[] {
  const shuffledArray = [...array];

  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }

  return shuffledArray;
}

const placeholders = shuffleArray([
  "Virtual interior design service",
  "App that tracks carbon footprint",
  "Eco-friendly fashion brand",
  "Language learning platform that connects users with native speakers",
  "Mental health app that provides personalized therapy sessions",
  "Subscription box service for healthy snacks",
  "Social network for artists",
  "Personal finance app that helps users stick to a budget",
  "Platform for connecting freelancers with projects",
  "Educational website that teaches practical skills",
  "Mobile app that gamifies fitness",
  "Online marketplace for vintage clothing",
  "Online course that teaches entrepreneurship",
  "Sustainable home cleaning service",
  "Personalized nutrition plan service",
  "Virtual book club",
  "E-commerce platform for independent artists",
  "AI-powered online language translation service",
  "Mobile app that helps users find and book last-minute travel deals",
  "Sustainable and ethical fashion rental service",
  "Web-based project management tool for remote teams",
  "Home workout equipment rental service",
  "Online platform that provides mental health resources",
  "AI-powered job search platform",
  "Subscription service for DIY and craft projects",
  "Community-driven crowdfunding platform",
  "Virtual reality platform for remote team building",
]);

export function useDynamicPlaceholder(id: string, enabled: boolean) {
  useEffect(() => {
    const element = document.getElementById(id);

    let mounted = true;
    let characterIndex = 0;
    let placeholderIndex = 0;
    let typingForwards = true;
    let waitAtEnd = 200;
    let timeout: NodeJS.Timeout;

    (function changePlaceholder() {
      logic: if (mounted && enabled) {
        if (!typingForwards && characterIndex === 0) {
          typingForwards = true;
          placeholderIndex = (placeholderIndex + 1) % placeholders.length;
        } else if (
          typingForwards &&
          characterIndex === placeholders[placeholderIndex].length
        ) {
          if (waitAtEnd === 0) {
            waitAtEnd = 200;
            typingForwards = false;
          } else {
            waitAtEnd--;
            break logic;
          }
        }

        characterIndex = typingForwards
          ? characterIndex + 1
          : characterIndex - 1;

        if (element !== null) {
          element.setAttribute(
            "placeholder",
            placeholders[placeholderIndex].slice(0, characterIndex)
          );
        }
      }

      timeout = setTimeout(changePlaceholder, Math.floor(Math.random() * 20));
    })();

    return () => {
      clearTimeout(timeout);
      mounted = false;
    };
  }, [enabled, id]);
}
