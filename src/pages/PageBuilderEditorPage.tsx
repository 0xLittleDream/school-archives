import { Layout } from '@/components/layout/Layout';
import { PageBuilderEditor } from '@/components/admin/page-builder/PageBuilderEditor';

const PageBuilderEditorPage = () => {
  return (
    <Layout>
      <div className="container py-8">
        <PageBuilderEditor />
      </div>
    </Layout>
  );
};

export default PageBuilderEditorPage;
