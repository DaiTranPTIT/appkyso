import useInitModel from '@/hooks/useInitModel';
import { ipCore } from '@/utils/ip';

export default () => {
	const objInit = useInitModel<PhanVungDuLieu.IUser>('data-partition/user', undefined, undefined, ipCore);

	return {
		...objInit,
	};
};
