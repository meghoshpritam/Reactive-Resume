import {
  Award,
  Certification,
  CustomSection,
  CustomSectionGroup,
  Education,
  Experience,
  Interest,
  Project,
  Publication,
  Reference,
  SectionKey,
  SectionWithItem,
  URL,
  Volunteer,
} from "@reactive-resume/schema";
import {
  cn,
  EducationTypes,
  educationTypes,
  ExperienceJobTypes,
  experienceJobTypes,
  ExperienceWorkTypes,
  experienceWorkTypes,
  getSkillsByGroup,
  isEmptyString,
  isUrl,
} from "@reactive-resume/utils";
import get from "lodash.get";
import React, { Fragment } from "react";
import { twMerge } from "tailwind-merge";

import { Picture } from "../components/picture";
import { useArtboardStore } from "../store/artboard";
import { TemplateProps } from "../types/template";

const DEFAULT_BORDER_CLASS_NAME = "border-b border-gray-500 border-dashed";

const Header = () => {
  const basics = useArtboardStore((state) => state.resume.basics);
  const profiles = useArtboardStore((state) => state.resume.sections.profiles);
  const fontSize = useArtboardStore((state) => state.resume.metadata.typography.font.size);

  return (
    <div className="flex items-center justify-between space-x-4 pb-0">
      <div className="flex-1 space-y-2">
        <div>
          <div className="text-32 font-bld uppercase">{basics.name}</div>
          <div className="text-20 mt-1 text-primary">{basics.headline}</div>
        </div>

        <div className="grid grid-cols-2 items-center gap-x-5 gap-y-1.5 text-sm">
          {basics.phone && (
            <div className="flex items-center gap-x-1.5">
              <i className="ph ph-bold ph-phone text-primary" />
              <a
                href={`tel:${basics.phone.replace(/[^0-9+]/g, "")}`}
                target="_blank"
                rel="noreferrer"
              >
                {basics.phone}
              </a>
            </div>
          )}
          {basics.email && (
            <div className="flex items-center gap-x-1.5">
              <i className="ph ph-bold ph-at text-primary" />
              <a href={`mailto:${basics.email}`} target="_blank" rel="noreferrer">
                {basics.email}
              </a>
            </div>
          )}
          <Link url={basics.url} />
          {basics.customFields.map((item) => (
            <div key={item.id} className="flex items-center gap-x-1.5">
              <i className={cn(`ph ph-bold ph-${item.icon}`, "text-primary")} />
              {item.value.match(/^https?:\/\//) ? (
                <a
                  href={item.value}
                  target="_blank"
                  rel="noreferrer noopener nofollow"
                  className={"inline-block"}
                >
                  {item.name}
                </a>
              ) : (
                <span>{[item.name, item.value].filter(Boolean).join(": ")}</span>
              )}
            </div>
          ))}
          {basics.location && (
            <div className="flex items-center gap-x-1.5">
              <i className="ph ph-bold ph-map-pin text-primary" />
              <div>{basics.location}</div>
            </div>
          )}
        </div>
      </div>

      {profiles.visible && profiles.items.length > 0 && (
        <div
          className="grid gap-x-4 gap-y-1 text-right"
          style={{ gridTemplateColumns: `repeat(${profiles.columns}, auto)` }}
        >
          {profiles.items
            .filter((item) => item.visible)
            .map((item) => (
              <div key={item.id} className="flex items-center gap-x-2">
                <Link
                  url={item.url}
                  label={item.username}
                  className="text-sm"
                  icon={
                    <img
                      className="ph"
                      width={fontSize}
                      height={fontSize}
                      alt={item.network}
                      src={`https://cdn.simpleicons.org/${item.icon}`}
                    />
                  }
                />
              </div>
            ))}
        </div>
      )}

      <Picture />
    </div>
  );
};

const Summary = () => {
  const section = useArtboardStore((state) => state.resume.sections.summary);

  if (!section.visible || isEmptyString(section.content)) return null;

  return (
    <SectionContainer
      sectionId={section.id}
      sectionName={section.name}
      sectionColumns={section.columns}
    >
      <div
        className="wysiwyg"
        style={{ columns: section.columns }}
        dangerouslySetInnerHTML={{ __html: section.content }}
      />
    </SectionContainer>
  );
};

type RatingProps = { level: number };

const Rating = ({ level }: RatingProps) => (
  <div className="flex items-center gap-x-1.5">
    {Array.from({ length: 5 }).map((_, index) => (
      <div
        key={index}
        className={cn("size-3 rounded border-2 border-primary", level > index && "bg-primary")}
      />
    ))}
  </div>
);

type LinkProps = {
  url: URL;
  icon?: React.ReactNode;
  label?: string;
  className?: string;
};

const Link = ({ url, icon, label, className }: LinkProps) => {
  if (!isUrl(url.href)) return null;

  return (
    <div className="flex items-center gap-x-1.5">
      {icon ?? <i className="ph ph-bold ph-link text-primary" />}
      <a
        href={url.href}
        target="_blank"
        rel="noreferrer noopener nofollow"
        className={cn("inline-block", className)}
      >
        {label || url.label || url.href}
      </a>
    </div>
  );
};

type SectionProps<T> = {
  section: SectionWithItem<T> | CustomSectionGroup;
  children?: (item: T) => React.ReactNode;
  className?: string;
  urlKey?: keyof T;
  levelKey?: keyof T;
  summaryKey?: keyof T;
  keywordsKey?: keyof T;
};

type SectionContainerProps = {
  children: React.ReactNode;
  sectionId: string;
  sectionName: string;
  sectionColumns: number;
  className?: string;
};

const SectionContainer = ({
  sectionId,
  children,
  sectionName,
  sectionColumns,
  className = "",
}: SectionContainerProps) => {
  return (
    <section id={sectionId} className={twMerge("grid", className)}>
      <h4 className="mb-2 w-full border-b-2 border-secondary text-2xl font-bold uppercase text-secondary">
        {sectionName}
      </h4>

      <div
        className="grid gap-x-6 gap-y-3"
        style={{ gridTemplateColumns: `repeat(${sectionColumns}, 1fr)` }}
      >
        {children}
      </div>
    </section>
  );
};

const SectionPrimaryHeading = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return <h5 className={twMerge("text-17 font-bold", className)}>{children}</h5>;
};

const SectionSecondaryHeading = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return <p className={twMerge("text-15 font-bold text-primary", className)}>{children}</p>;
};

const Section = <T,>({
  section,
  children,
  className,
  urlKey,
  levelKey,
  summaryKey,
  keywordsKey,
}: SectionProps<T>) => {
  if (!section.visible || !section.items.length) return null;

  return (
    <SectionContainer
      sectionId={section.id}
      sectionName={section.name}
      sectionColumns={section.columns}
      className={className}
    >
      {section.items
        .filter((item) => item.visible)
        .map((item: any) => {
          const url = (urlKey && get(item, urlKey)) as URL | undefined;
          const level = (levelKey && get(item, levelKey, 0)) as number | undefined;
          const summary = (summaryKey && get(item, summaryKey, "")) as string | undefined;
          const keywords = (keywordsKey && get(item, keywordsKey, [])) as string[] | undefined;

          return (
            <div
              key={item.id}
              className={cn(
                "space-y-2",
                item.showBorder ? DEFAULT_BORDER_CLASS_NAME : "",
                className,
              )}
            >
              <div>
                {children?.(item as T)}
                {url !== undefined && <Link url={url} />}
              </div>

              {summary !== undefined && !isEmptyString(summary) && (
                <div className="wysiwyg" dangerouslySetInnerHTML={{ __html: summary }} />
              )}

              {level !== undefined && level > 0 && <Rating level={level} />}

              {keywords !== undefined && keywords.length > 0 && (
                <p className="text-sm">{keywords.join(", ")}</p>
              )}
            </div>
          );
        })}
    </SectionContainer>
  );
};

const Experience = () => {
  const section = useArtboardStore((state) => state.resume.sections.experience);

  return (
    <Section<Experience>
      section={{
        ...section,
        items: section.items.map((item, index) => ({
          ...item,
          showBorder: index !== section.items.length - 1,
        })),
      }}
      summaryKey="summary"
      className={twMerge("mb-2")}
    >
      {(item) => (
        <div className="flex items-start justify-between">
          <div className="text-left">
            <SectionPrimaryHeading>{item.position}</SectionPrimaryHeading>
            <SectionSecondaryHeading>{item.company}</SectionSecondaryHeading>
            <div className="mt-1 flex items-center text-sm">
              {item.jobType && (
                <div>{experienceJobTypes[item.jobType as keyof ExperienceJobTypes]}</div>
              )}
              {item.jobType && item.workType && <div className="mx-1.5">|</div>}
              {item.workType && (
                <div>{experienceWorkTypes[item.workType as keyof ExperienceWorkTypes]}</div>
              )}

              {(item.jobType || item.workType) && isUrl(item?.url?.href) && (
                <div className="mx-1.5">|</div>
              )}
              <Link url={item.url} />
            </div>
          </div>

          <div className="text-15 shrink-0 text-right">
            <div className="mb-1 font-bold">{item.date}</div>
            {item.location && (
              <div className="">
                <i className="ph ph-bold ph-map-pin text-primary" /> {item.location}
              </div>
            )}
          </div>
        </div>
      )}
    </Section>
  );
};

const Education = () => {
  const section = useArtboardStore((state) => state.resume.sections.education);

  return (
    <Section<Education>
      section={{
        ...section,
        items: section.items.map((item, index) => ({
          ...item,
          showBorder: index !== section.items.length - 1,
        })),
      }}
      summaryKey="summary"
    >
      {(item: any) => (
        <div className="flex items-start justify-between pb-1.5">
          <div className="text-left">
            <SectionPrimaryHeading>{item.area}</SectionPrimaryHeading>
            <SectionSecondaryHeading>{item.institution}</SectionSecondaryHeading>
            <div className="mt-1 flex text-sm">
              <span>{item.studyType}</span>
              <span className="mx-1.5">|</span>
              {item.score && (
                <>
                  <span>{item.score}</span>
                  <span className="mx-1.5">|</span>
                </>
              )}
              <span>{educationTypes[item.educationType as keyof EducationTypes]}</span>
              <span className="mx-1.5">|</span>
              <Link url={item.url} />
            </div>
          </div>

          <div className="text-15 shrink-0 text-right">
            <div className="mb-1 font-bold">{item.date}</div>
            {item.location && (
              <div>
                <i className="ph ph-bold ph-map-pin text-primary" /> {item.location}
              </div>
            )}
          </div>
        </div>
      )}
    </Section>
  );
};

const Awards = () => {
  const section = useArtboardStore((state) => state.resume.sections.awards);

  return (
    <Section<Award> section={section} urlKey="url" summaryKey="summary">
      {(item) => (
        <div className="flex items-start justify-between">
          <div className="text-left">
            <div className="font-bold">{item.title}</div>
            <div>{item.awarder}</div>
          </div>

          <div className="shrink-0 text-right">
            <div className="font-bold">{item.date}</div>
          </div>
        </div>
      )}
    </Section>
  );
};

const Certifications = () => {
  const section = useArtboardStore((state) => state.resume.sections.certifications);

  return (
    <Section<Certification> section={section} summaryKey="summary">
      {(item) => (
        <div className="flex items-start justify-between">
          <div className="text-left">
            <SectionPrimaryHeading>{item.name}</SectionPrimaryHeading>
            <div className="flex">
              <SectionSecondaryHeading>{item.issuer}</SectionSecondaryHeading>
              {item.issuer && item.url && <span className="mx-1.5">|</span>}
              <Link url={item.url} className="text-sm" />
            </div>
          </div>

          <div className="text-15 shrink-0 text-right">
            <div className="font-bold">{item.date}</div>
          </div>
        </div>
      )}
    </Section>
  );
};

const Skills = () => {
  const section = useArtboardStore((state) => state.resume.sections.skills);
  const skillsByGroup = getSkillsByGroup(section?.items || []);

  if (!section.visible || !skillsByGroup.length) return null;

  return (
    <SectionContainer sectionId={section.id} sectionName={section.name} sectionColumns={1}>
      {skillsByGroup.map((group) => (
        <div key={group.group} className="mt-2">
          {group.group && (
            <SectionPrimaryHeading className="mb-1.5 text-primary">
              {group.group}
            </SectionPrimaryHeading>
          )}

          <div className="flex flex-wrap gap-x-4 gap-y-2.5 text-sm">
            {group.skills.map((skill) => (
              <div
                key={skill.id}
                className="flex shrink-0 items-center gap-x-2 rounded-sm border border-gray-500 px-2.5 py-0.5"
              >
                <div className="font-bold">{skill.name}</div>
                <div>{skill.description}</div>
                {skill.level > 0 && <Rating level={skill.level} />}
                {skill.keywords.length > 0 && (
                  <p className="text-sm">{skill.keywords.join(", ")}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </SectionContainer>
  );
};

const Interests = () => {
  const section = useArtboardStore((state) => state.resume.sections.interests);

  return (
    <Section<Interest> section={section} keywordsKey="keywords" className="space-y-0.5">
      {(item) => <div className="font-bold">{item.name}</div>}
    </Section>
  );
};

const Publications = () => {
  const section = useArtboardStore((state) => state.resume.sections.publications);

  return (
    <Section<Publication> section={section} urlKey="url" summaryKey="summary">
      {(item) => (
        <div className="flex items-start justify-between">
          <div className="text-left">
            <div className="font-bold">{item.name}</div>
            <div>{item.publisher}</div>
          </div>

          <div className="shrink-0 text-right">
            <div className="font-bold">{item.date}</div>
          </div>
        </div>
      )}
    </Section>
  );
};

const Volunteer = () => {
  const section = useArtboardStore((state) => state.resume.sections.volunteer);

  return (
    <Section<Volunteer> section={section} urlKey="url" summaryKey="summary">
      {(item) => (
        <div className="flex items-start justify-between">
          <div className="text-left">
            <div className="font-bold">{item.organization}</div>
            <div>{item.position}</div>
          </div>

          <div className="shrink-0 text-right">
            <div className="font-bold">{item.date}</div>
            <div>{item.location}</div>
          </div>
        </div>
      )}
    </Section>
  );
};

const Languages = () => {
  const section = useArtboardStore((state) => state.resume.sections.languages);

  return (
    <SectionContainer
      sectionId={section.id}
      sectionName={section.name}
      sectionColumns={section.columns}
    >
      <div className="grid grid-cols-5 items-center gap-y-1">
        <div className="border-b pb-0.5 font-bold">Languages</div>
        <div className="border-b pb-0.5 font-bold">Proficiency</div>
        <div className="border-b pb-0.5 font-bold">Speak</div>
        <div className="border-b pb-0.5 font-bold">Read</div>
        <div className="border-b pb-0.5 font-bold">Write</div>
        {section.items.map((item) => {
          if (!item.visible) return null;

          return (
            <Fragment key={item.name}>
              <div className="font-semibold">{item.name}</div>
              <div className="">{item.description}</div>
              <div className="">{item.speak ? <i className="ph ph-seal-check"></i> : null}</div>
              <div className="">{item.read ? <i className="ph ph-seal-check"></i> : null}</div>
              <div className="">{item.write ? <i className="ph ph-seal-check"></i> : null}</div>
            </Fragment>
          );
        })}
      </div>
    </SectionContainer>
  );
};

const Projects = () => {
  const section = useArtboardStore((state) => state.resume.sections.projects);

  return (
    <Section<Project> section={section} urlKey="url" summaryKey="summary" keywordsKey="keywords">
      {(item) => (
        <div className="flex items-start justify-between">
          <div className="text-left">
            <div className="font-bold">{item.name}</div>
            <div>{item.description}</div>
          </div>

          <div className="shrink-0 text-right">
            <div className="font-bold">{item.date}</div>
          </div>
        </div>
      )}
    </Section>
  );
};

const References = () => {
  const section = useArtboardStore((state) => state.resume.sections.references);

  return (
    <Section<Reference> section={section} urlKey="url" summaryKey="summary">
      {(item) => (
        <div>
          <div className="font-bold">{item.name}</div>
          <div>{item.description}</div>
        </div>
      )}
    </Section>
  );
};

const Custom = ({ id }: { id: string }) => {
  const section = useArtboardStore((state) => state.resume.sections.custom[id]);

  if (section.name.startsWith("profiles.")) return <SocialProfiles id={id} />;

  return (
    <Section<CustomSection>
      section={{
        ...section,
        items: section.items.map((item, index) => ({
          ...item,
          showBorder: index !== section.items.length - 1,
        })),
      }}
      urlKey="url"
      summaryKey="summary"
      keywordsKey="keywords"
    >
      {(item) => (
        <div className="flex items-start justify-between">
          <div className="text-left">
            <SectionPrimaryHeading>{item.name}</SectionPrimaryHeading>
            <div>{item.description}</div>
          </div>

          <div className="shrink-0 text-right">
            <div className="font-bold">{item.date}</div>
            <div>{item.location}</div>
          </div>
        </div>
      )}
    </Section>
  );
};

const SocialProfiles = ({ id }: { id: string }) => {
  const section = useArtboardStore((state) => state.resume.sections.custom[id]);
  const profiles = useArtboardStore((state) => state.resume.sections.profiles);

  if (!section.visible) return null;

  return (
    <SectionContainer
      sectionId={section.id}
      sectionName={section.name.split(".")[1]}
      sectionColumns={section.columns}
    >
      {profiles.items
        .filter((item) => item.visible)
        .map((item) => (
          <div key={item.id} className="mt-2">
            <div className="flex items-center">
              <img
                className="ph mr-2"
                width={16}
                height={16}
                alt={item.network}
                src={`https://cdn.simpleicons.org/${item.icon}`}
              />
              <p>{item.network}</p>
            </div>
            <Link url={item.url} className="ml-2 mt-1.5 text-sm" />
          </div>
        ))}
    </SectionContainer>
  );
};

const mapSectionToComponent = (section: SectionKey) => {
  switch (section) {
    case "summary":
      return <Summary />;
    case "experience":
      return <Experience />;
    case "education":
      return <Education />;
    case "awards":
      return <Awards />;
    case "certifications":
      return <Certifications />;
    case "skills":
      return <Skills />;
    case "interests":
      return <Interests />;
    case "publications":
      return <Publications />;
    case "volunteer":
      return <Volunteer />;
    case "languages":
      return <Languages />;
    case "projects":
      return <Projects />;
    case "references":
      return <References />;
    default:
      if (section.startsWith("custom.")) return <Custom id={section.split(".")[1]} />;

      return null;
  }
};

export const Onyx = ({ columns, isFirstPage = false }: TemplateProps) => {
  const [main, sidebar] = columns;

  return (
    <div className="p-custom space-y-6">
      {isFirstPage && <Header />}

      {main.map((section) => (
        <Fragment key={section}>{mapSectionToComponent(section)}</Fragment>
      ))}

      {sidebar.map((section) => (
        <Fragment key={section}>{mapSectionToComponent(section)}</Fragment>
      ))}
    </div>
  );
};
