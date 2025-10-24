type PageHeaderProps = {
  title: string;
  description?: string;
};

export default function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <section className="bg-card py-12 sm:py-16">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center">
          <h1 className="font-headline text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            {title}
          </h1>
          {description && (
            <p className="mx-auto mt-6 max-w-3xl text-lg text-muted-foreground">
              {description}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
