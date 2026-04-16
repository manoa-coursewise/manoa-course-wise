import * as Yup from 'yup';

export const AddStuffSchema = Yup.object({
  name: Yup.string().required(),
  quantity: Yup.number().positive().required(),
  condition: Yup.string().oneOf(['excellent', 'good', 'fair', 'poor']).required(),
  owner: Yup.string().required(),
});

export const EditStuffSchema = Yup.object({
  id: Yup.number().required(),
  name: Yup.string().required(),
  quantity: Yup.number().positive().required(),
  condition: Yup.string().oneOf(['excellent', 'good', 'fair', 'poor']).required(),
  owner: Yup.string().required(),
});

export const SubmitReviewSchema = Yup.object({
  courseCode: Yup.string().required(),
  professor: Yup.string().required(),
  rating: Yup.number().min(1).max(5).required(),
  text: Yup.string().required(),
  anonymous: Yup.boolean().required(),
  authorEmail: Yup.string().email().nullable(),
  tags: Yup.array().of(Yup.string()),
  semesterTaken: Yup.string().nullable(),
});
