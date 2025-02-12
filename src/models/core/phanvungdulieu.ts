import useInitModel from '@/hooks/useInitModel';
import { ipCore } from '@/utils/ip';

export default () => {
	const objInit = useInitModel<PhanVungDuLieu.IRecord>('data-partition', undefined, undefined, ipCore);

	return {
		...objInit,
	};
};
