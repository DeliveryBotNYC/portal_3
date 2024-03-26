import OrderAssigned from "./trackDetailsCard/OrderAssigned";
import OrderDelivered from "./trackDetailsCard/OrderDelivered";
import OrderPicked from "./trackDetailsCard/OrderPicked";
import OrderProcessing from "./trackDetailsCard/OrderProcessing";

const PickedUpInfo = () => {
  return (
    <div className="w-full">
      <OrderDelivered isCompleted={false} />
      <OrderPicked isCompleted={true} />
      <OrderAssigned isCompleted={true} />
      <OrderProcessing />
    </div>
  );
};

export default PickedUpInfo;