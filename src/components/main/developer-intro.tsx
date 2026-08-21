import { FileText, Mail } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import ProfilePhotoModal from "@/components/ui/extended/profile-photo-modal";
import { DeveloperDetails } from "@/dev-constants/details";
import ShellWrapper from "../layouts/shell-wrapper";

/** Keyboard hint pill — mirrors the shortcuts wired up in the site header. */
const Kbd = ({ children }: { children: React.ReactNode }) => (
  <kbd className="ml-1 rounded border bg-muted px-1.5 py-0.5 font-mono text-[10px] leading-none text-muted-foreground">
    {children}
  </kbd>
);

const DeveloperIntro = () => {
  const { name, designation, bio, avatar, email, resume } = DeveloperDetails;

  return (
    <ShellWrapper wide>
      <div className="px-2 pt-12 pb-14">
        <div className="flex flex-col gap-5 md:flex-row md:items-start md:gap-6">
          <ProfilePhotoModal
            src={avatar}
            alt={`Profile photo of ${name}, ${designation}`}
            name={name}
            designation={designation}
            email={email}
            resume={resume}
          >
            {/*
              md:mt-2 pulls the photo down onto the name's cap height. Flex `items-start`
              aligns it to the h1's box top, which sits above the glyphs by the line's
              half-leading — without this nudge the photo reads as floating high.
            */}
            <Image
              src={avatar}
              alt={`Profile photo of ${name}, ${designation}`}
              width={144}
              height={144}
              priority
              sizes="(min-width: 768px) 144px, 112px"
              className="h-28 w-28 shrink-0 rounded-xl border object-cover md:mt-2 md:h-36 md:w-36"
              title={`Avatar of ${name}`}
            />
          </ProfilePhotoModal>

          <div className="min-w-0 flex-1">
            <h1 className="text-[2rem] font-medium leading-[1.15] tracking-tight text-foreground md:text-[2.375rem]">
              {name}
            </h1>
            <p className="mt-1.5 text-[15px] text-muted-foreground">{designation}</p>

            <p className="mt-4 max-w-[64ch] text-[15px] leading-[1.7] text-muted-foreground">
              {bio}
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-3">
              {email && (
                <Link
                  href={`mailto:${email}`}
                  className="inline-flex items-center gap-2 text-sm text-foreground transition-colors hover:text-muted-foreground"
                >
                  <Mail className="size-4 text-muted-foreground" />
                  Email
                  <Kbd>E</Kbd>
                </Link>
              )}
              {resume && (
                <Link
                  href={resume}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex items-center gap-2 text-sm text-foreground transition-colors hover:text-muted-foreground"
                >
                  <FileText className="size-4 text-muted-foreground" />
                  Resume
                  <Kbd>R</Kbd>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </ShellWrapper>
  );
};

export default DeveloperIntro;
