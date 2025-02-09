import ky from 'ky';

export interface CategoryItem {
  categoryCode: string;
  categoryName: string;
  href?: string;
  icon?: React.ReactNode;
  label?: string;
}

export interface CategoryGroup {
  categoryList: CategoryItem[];
  majorCategoryNm: string;
}

interface CategoryResponse {
  status: string;
  message: string;
  data: {
    categories: CategoryGroup[];
  };
}

export const getCategories = async (): Promise<CategoryResponse> => {
  return await ky.get(`${process.env.NEXT_PUBLIC_BASE_URL}/mains/categories/all`).json();
};
