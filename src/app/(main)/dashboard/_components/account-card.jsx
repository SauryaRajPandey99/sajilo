import React from "react";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "../../../../components/ui/switch";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";

const AccountCard = ({ account }) => {
  const { name, type, balance, id, isDefault } = account;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{name}</CardTitle>
        <Switch />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          ${parseFloat(balance).toFixed(2)}
        </div>
        <p className="text-xs text-muted-foreground capitalize">
          {type.charAt(0) + type.slice(1).toLowerCase()} Account
        </p>
      </CardContent>
      <CardFooter>
        <div className="flex item-center">
          <ArrowUpRight className="mr-1 h-4 w-4 text-green-500" />
        </div>
        <div className="flex item-center">
          <ArrowDownRight className="mr-1 h-4 w-4 text-red-500" />
        </div>
      </CardFooter>
    </Card>
  );
};

export default AccountCard;
