
import { addCourseReview, getCourse, getCourseReviews, getCourses, getCourseTypes, likeCourse, likeCourseReview, removeCourse, removeCourses, updateCourse, uploadCourse } from "../../api/modules/courses"
import { useDelete, useGet, useUpdate, useUpload } from "../common/useData"

export const useGetCourseTypes = useGet(getCourseTypes, params, options)

export const useSearchCourse = useGet(getCourses, params, options)
export const useGetCourse = useGet(getCourse, params, options)
export const useUploadCourse = useUpload(uploadCourse, params, options)
export const useUpdateCourse = useUpdate(updateCourse, params, options)
export const useRemoveCourse = useDelete(removeCourse, params, options)
export const useRemoveCourses = useDelete(removeCourses, params, options)


export const useLikeCourse = useGet(likeCourse, params, options)
export const useGetCourseReviews = useGet(getCourseReviews, params, options)

export const useRemoveCourseReview = useDelete(removeCourseReview, params, options)
export const useAddCourseReview = useView(addCourseReview, params, options)
export const useLikeCourseReview = useGet(likeCourseReview, params, options)