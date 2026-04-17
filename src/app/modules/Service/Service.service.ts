import { QueryBuilder } from '../../utils/QueryBuilder';
import { IService } from './Service.interface';
import { Service } from './Service.model';

const createServiceIntoDB = async (payload: IService) => {
  const result = await Service.create(payload);
  return result;
};

const getAllServicesFromDB = async (query: Record<string, unknown>) => {
  const { data, meta } = await new QueryBuilder(Service.find(), query)
    .search(['title', 'description', 'content'])
    .filter()
    .sort()
    .paginate()
    .fields()
    .execute();

  return {
    data,
    meta,
  };
};

const getSingleServiceBySlugFromDB = async (slug: string) => {
  const result = await Service.findOne({ slug });
  return result;
};

const updateServiceBySlugFromDB = async (
  slug: string,
  payload: Partial<IService>,
) => {
  const result = await Service.findOneAndUpdate({ slug }, payload, {
    new: true,
    runValidators: true,
  });
  return result;
};

const deleteServiceBySlugFromDB = async (slug: string) => {
  const result = await Service.findOneAndUpdate(
    { slug },
    { isDeleted: true },
    { new: true },
  );
  return result;
};

export const ServiceServices = {
  createServiceIntoDB,
  getAllServicesFromDB,
  getSingleServiceBySlugFromDB,
  updateServiceBySlugFromDB,
  deleteServiceBySlugFromDB,
};
